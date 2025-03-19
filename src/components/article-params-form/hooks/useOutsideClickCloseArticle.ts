import React, { useEffect } from 'react';

type UseOutsideClickCloseArticle = {
	isOpen: boolean;
	rootRef: React.RefObject<HTMLElement>;
	onClose?: (newValue: boolean) => void;
};

/**
 * хук для закрытия сайд бара через клик на рандом место
 */

export const useOutsideClickCloseArticle = ({
	isOpen,
	rootRef,
	onClose,
}: UseOutsideClickCloseArticle) => {
	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			const { target } = event;
			if (
				isOpen &&
				target instanceof Node &&
				!rootRef.current?.contains(target)
			) {
				isOpen && onClose?.(false);
			}
		};
		window.addEventListener('mousedown', handleClick);
		return () => window.removeEventListener('mousedown', handleClick);
	}, [isOpen, onClose]);
};
