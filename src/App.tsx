import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

// Типы для транзакций
interface Transaction {
	id: number;
	description: string;
	amount: number;
	date: string;
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
						})
					}>
					Добавить трату
				</button>
			</div>

			{/* Просмотр истории трат за месяц */}
			<div>
				<h2>История трат за месяц</h2>
				<ul>
					{getMonthlyExpenses(
						new Date().getMonth(),
						new Date().getFullYear()
					).map((expense) => (
						<li key={expense.id}>
							{expense.description} - {expense.amount} руб. ({expense.date})
							<button onClick={() => deleteExpense(expense.id)}>Удалить</button>
							<button
								onClick={() =>
									editExpense(expense.id, {
										description: 'Новое описание',
										amount: 1000,
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
				{renderChart(new Date().getMonth(), new Date().getFullYear())}
			</div>
		</div>
	);
};

export default App;
