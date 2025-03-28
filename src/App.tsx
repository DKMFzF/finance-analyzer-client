import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

// Типы для транзакций
interface Transaction {
	id: number;
	description: string;
	amount: number;
	date: string;
	category?: string; // Добавляем категорию для расходов
}

// Ключ для localStorage
const STORAGE_KEY = 'financeAppData';

const App: React.FC = () => {
	// Загрузка данных из localStorage при инициализации
	const loadData = (): { transactions: Transaction[]; income: number } => {
		const savedData = localStorage.getItem(STORAGE_KEY);
		if (savedData) {
			return JSON.parse(savedData);
		}
		return { transactions: [], income: 0 };
	};

	// Сохранение данных в localStorage
	const saveData = (transactions: Transaction[], income: number): void => {
		const dataToSave = { transactions, income };
		localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
	};

	const [transactions, setTransactions] = useState<Transaction[]>(
		loadData().transactions
	);
	const [income, setIncome] = useState<number>(loadData().income);
	const [currentMonth, setCurrentMonth] = useState<number>(
		new Date().getMonth()
	);
	const [currentYear, setCurrentYear] = useState<number>(
		new Date().getFullYear()
	);

	// Сохраняем данные в localStorage при изменении состояния
	useEffect(() => {
		saveData(transactions, income);
	}, [transactions, income]);

	// 5. Функция внесения дохода пользователя
	const addIncome = (amount: number): void => {
		setIncome(income + amount);
	};

	// Функция внесения в историю трат пользователя
	const addExpense = (expense: Omit<Transaction, 'id'>): void => {
		const newTransaction = { ...expense, id: Date.now() };
		setTransactions([...transactions, newTransaction]);
	};

	// 6. Функция просмотра истории трат за выбранный месяц
	const getMonthlyExpenses = (month: number, year: number): Transaction[] => {
		return transactions.filter(
			(transaction) =>
				new Date(transaction.date).getMonth() === month &&
				new Date(transaction.date).getFullYear() === year
		);
	};

	// 7. Функция просмотра истории трат в виде графика
	const renderChart = (month: number, year: number): JSX.Element => {
		const monthlyExpenses = getMonthlyExpenses(month, year);
		const data = {
			labels: monthlyExpenses.map((expense) => expense.date),
			datasets: [
				{
					label: 'Траты',
					data: monthlyExpenses.map((expense) => expense.amount),
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 1,
				},
			],
		};

		return <Chart type='bar' data={data} />;
	};

	// 8. Функция удаления траты из истории
	const deleteExpense = (id: number): void => {
		setTransactions(
			transactions.filter((transaction) => transaction.id !== id)
		);
	};

	// 9. Функция редактирования уже внесённой траты
	const editExpense = (
		id: number,
		updatedExpense: Partial<Transaction>
	): void => {
		setTransactions(
			transactions.map((transaction) =>
				transaction.id === id
					? { ...transaction, ...updatedExpense }
					: transaction
			)
		);
	};

	// 9. Функция подсчёта общей суммы расходов за период
	const getTotalExpensesForPeriod = (
		startDate: string,
		endDate: string
	): number => {
		return transactions
			.filter(
				(transaction) =>
					transaction.date >= startDate && transaction.date <= endDate
			)
			.reduce((sum, transaction) => sum + transaction.amount, 0);
	};

	// 10. Функция подсчёта общей суммы доходов за период
	const getTotalIncomeForPeriod = (
		startDate: string,
		endDate: string
	): number => {
		// В вашем текущем коде доходы не привязаны к дате, поэтому просто возвращаем весь доход
		// Если нужно учитывать доходы по датам, нужно изменить структуру хранения доходов
		return income;
	};

	// 11. Функция вычисления разницы между доходами и расходами за месяц
	const getMonthlyBalance = (month: number, year: number): number => {
		const monthlyExpenses = getMonthlyExpenses(month, year).reduce(
			(sum, transaction) => sum + transaction.amount,
			0
		);
		return income - monthlyExpenses;
	};

	// 12. Функция формирования отчёта по категориям расходов
	const getCategoryReport = (
		month: number,
		year: number
	): Record<string, number> => {
		const monthlyExpenses = getMonthlyExpenses(month, year);
		const report: Record<string, number> = {};

		monthlyExpenses.forEach((expense) => {
			const category = expense.category || 'Без категории';
			report[category] = (report[category] || 0) + expense.amount;
		});

		return report;
	};

	// 13. Функция сравнения расходов за текущий месяц с прошлым
	const compareWithPreviousMonth = (): {
		current: number;
		previous: number;
		difference: number;
	} => {
		const currentMonthExpenses = getMonthlyExpenses(
			currentMonth,
			currentYear
		).reduce((sum, transaction) => sum + transaction.amount, 0);

		let prevMonth = currentMonth - 1;
		let prevYear = currentYear;
		if (prevMonth < 0) {
			prevMonth = 11;
			prevYear--;
		}

		const previousMonthExpenses = getMonthlyExpenses(
			prevMonth,
			prevYear
		).reduce((sum, transaction) => sum + transaction.amount, 0);

		return {
			current: currentMonthExpenses,
			previous: previousMonthExpenses,
			difference: currentMonthExpenses - previousMonthExpenses,
		};
	};

	return (
		<div>
			<h1>Учет финансов</h1>

			{/* Форма для добавления дохода */}
			<div>
				<h2>Добавить доход</h2>
				<input
					type='number'
					placeholder='Сумма дохода'
					onChange={(e) => addIncome(parseFloat(e.target.value))}
				/>
			</div>

			{/* Форма для добавления траты */}
			<div>
				<h2>Добавить трату</h2>
				<input type='text' placeholder='Описание' id='description' />
				<input type='number' placeholder='Сумма' id='amount' />
				<input type='date' id='date' />
				<input
					type='text'
					placeholder='Категория (опционально)'
					id='category'
				/>
				<button
					onClick={() =>
						addExpense({
							description: (
								document.getElementById('description') as HTMLInputElement
							).value,
							amount: parseFloat(
								(document.getElementById('amount') as HTMLInputElement).value
							),
							date: (document.getElementById('date') as HTMLInputElement).value,
							category: (
								document.getElementById('category') as HTMLInputElement
							).value,
						})
					}>
					Добавить трату
				</button>
			</div>

			{/* Просмотр истории трат за месяц */}
			<div>
				<h2>История трат за месяц</h2>
				<div>
					<label>
						Месяц:
						<input
							type='month'
							value={`${currentYear}-${String(currentMonth + 1).padStart(
								2,
								'0'
							)}`}
							onChange={(e) => {
								const [year, month] = e.target.value.split('-');
								setCurrentMonth(parseInt(month) - 1);
								setCurrentYear(parseInt(year));
							}}
						/>
					</label>
				</div>
				<ul>
					{getMonthlyExpenses(currentMonth, currentYear).map((expense) => (
						<li key={expense.id}>
							{expense.description} - {expense.amount} руб. ({expense.date}){' '}
							{expense.category && `[${expense.category}]`}
							<button onClick={() => deleteExpense(expense.id)}>Удалить</button>
							<button
								onClick={() =>
									editExpense(expense.id, {
										description:
											prompt('Новое описание:', expense.description) ||
											expense.description,
										amount: parseFloat(
											prompt('Новая сумма:', expense.amount.toString()) ||
												expense.amount.toString()
										),
									})
								}>
								Редактировать
							</button>
						</li>
					))}
				</ul>
			</div>

			{/* График трат за месяц */}
			<div>
				<h2>График трат за месяц</h2>
				{renderChart(currentMonth, currentYear)}
			</div>

			{/* Новые функции */}
			<div>
				<h2>Финансовый отчёт</h2>

				{/* 9. Общая сумма расходов за период */}
				<div>
					<h3>Общие расходы за месяц</h3>
					<p>
						{getMonthlyExpenses(currentMonth, currentYear).reduce(
							(sum, transaction) => sum + transaction.amount,
							0
						)}{' '}
						руб.
					</p>
				</div>

				{/* 10. Общая сумма доходов */}
				<div>
					<h3>Общие доходы</h3>
					<p>{income} руб.</p>
				</div>

				{/* 11. Разница между доходами и расходами */}
				<div>
					<h3>Баланс за месяц</h3>
					<p>{getMonthlyBalance(currentMonth, currentYear)} руб.</p>
				</div>

				{/* 12. Отчёт по категориям */}
				<div>
					<h3>Расходы по категориям</h3>
					<ul>
						{Object.entries(getCategoryReport(currentMonth, currentYear)).map(
							([category, amount]) => (
								<li key={category}>
									{category}: {amount} руб.
								</li>
							)
						)}
					</ul>
				</div>

				{/* 13. Сравнение с прошлым месяцем */}
				<div>
					<h3>Сравнение с прошлым месяцем</h3>
					{(() => {
						const comparison = compareWithPreviousMonth();
						return (
							<>
								<p>Текущий месяц: {comparison.current} руб.</p>
								<p>Прошлый месяц: {comparison.previous} руб.</p>
								<p
									style={{
										color: comparison.difference >= 0 ? 'red' : 'green',
									}}>
									Разница: {Math.abs(comparison.difference)} руб. (
									{comparison.difference >= 0 ? 'больше' : 'меньше'})
								</p>
							</>
						);
					})()}
				</div>
			</div>
		</div>
	);
};

export default App;
