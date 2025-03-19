import { useEffect } from 'react';

type UseOutsideClickClose = {
	isOpen: boolean;
	onChange: (newValue: boolean) => void;
	onClose?: () => void;
	rootRef: React.RefObject<HTMLDivElement>;
};

/**
 * хук для закрытия дропдауна с помощью клика на рандомную область
 */

export const useOutsideClickClose = ({
	isOpen,
	rootRef,
	onClose,
	onChange,
}: UseOutsideClickClose) => {
	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			const { target } = event;
			// проверка на то был ли клик совершен вне компонента
			if (
				target instanceof Node && // является ли цель клика элемент DOM
				!rootRef.current?.contains(target) // находится ли цель внутри rootRef()
			) {
				isOpen && onClose?.(); // если isOpen == true то вызывается onClose
				onChange?.(false); // изменение состояние после закрытия
			}
		};

		window.addEventListener('mousedown', handleClick); // довобление обработчика клика на весь документ

		return () => {
			window.removeEventListener('mousedown', handleClick); // удаляет обработчик события при размонтировании компонента
		};
	}, [onClose, onChange, isOpen]);
};
