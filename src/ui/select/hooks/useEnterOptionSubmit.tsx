import { useEffect } from 'react';
import { OptionType } from 'src/constants/articleProps';

type UseEnterOptionSubmit = {
	onClick: (value: OptionType['value']) => void;
	value: OptionType['value'];
	optionRef: React.RefObject<HTMLLIElement>;
};

/**
 * Кастомный хук для того чтобы выбирать опции нажатием на Enter
 * - useEffect срабатывает после монтирования <Option>
 * - Хук получает optionRef (ссылается на <li>)
 * - Если элемент <li> существует, навешивается обработчик keydown
 * - Если фокус на элементе и нажата Enter, вызывается onClick(value)
 * - После размонтирования компонента обработчик удаляется
 */

export const useEnterOptionSubmit = ({
	onClick,
	value,
	optionRef,
}: UseEnterOptionSubmit): void => {
	useEffect(() => {
		const option: HTMLLIElement | null = optionRef.current;
		if (!option) return;
		const handleEnterKeyDown = (event: KeyboardEvent) => {
			if (document.activeElement === option && event.key === 'Enter')
				onClick(value);
		};

		option.addEventListener('keydown', handleEnterKeyDown);
		return (): void =>
			option.removeEventListener('keydown', handleEnterKeyDown);
	}, [value, onClick, optionRef]);
};
