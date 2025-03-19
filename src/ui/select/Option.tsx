import React, { useRef } from 'react';
import type { MouseEventHandler } from 'react';
import clsx from 'clsx';
import { OptionType } from 'src/constants/articleProps';
import { Text } from 'src/ui/text';
import { isFontFamilyClass } from './helpers/isFontFamilyClass';
import { useEnterOptionSubmit } from './hooks/useEnterOptionSubmit';

import styles from './Select.module.scss';

type OptionProps = {
	option: OptionType;
	onClick: (value: OptionType['value']) => void;
};

/**
 * Компонент опции в спеске всплывающих опций
 * @param props - состоит из option (значения опции) и onClick (функция обработчик)
 */

/**
 * Объяснение для чего нужен handleClick:
 * Когда React обрабатывает onCkick он просит ссылку на функцию, а не вызов функции
 * которая будет после того как нажать на элемент. То есть React пердеаёт именно
 * ссылку, а не результат её выполнения. После того как ссылка передалась (после клика на li),
 * handleClick передаёт функцию onCkick, которая затем вызывается и выполняется.
 * Это нужно для того что бы вызвать функцию после клика, а не при рендаринге компонента.
 * Запись функции handleClick эквевалентна записи: {() => onClick(value)}. Такая запись
 * удобна для переиспользования.
 */

export const Option = (props: OptionProps): React.JSX.Element => {
	const {
		option: { value, title, optionClassName, className },
		onClick,
	} = props;
	const optionRef: React.RefObject<HTMLLIElement> = useRef<HTMLLIElement>(null);

	// функция высшего порядка реализована так потому что:
	// когда React обрабатывает onClick,
	// он ожидает функцию, а не результат её выполнения
	// она как бы обёртка для я onClick
	const handleClick =
		(clickedValue: OptionType['value']): MouseEventHandler<HTMLLIElement> =>
		(): void =>
			onClick(clickedValue);

	// кастомный хук для выбора опции через клавишу enter
	useEnterOptionSubmit({
		optionRef,
		value,
		onClick,
	});

	return (
		<li
			className={clsx(styles.option, styles[optionClassName || ''])}
			value={value}
			onClick={handleClick(value)}
			tabIndex={0} // используется для доступность a11y. позволяет выделть li с помощью tab
			data-testid={`select-option-${value}`}
			ref={optionRef}>
			<Text family={isFontFamilyClass(className) ? className : undefined}>
				{title}
			</Text>
		</li>
	);
};
