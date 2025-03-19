import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import clsx from 'clsx';
import styles from './ArticleParamsForm.module.scss';
import { useState, useRef } from 'react';
import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	ArticleStateType,
	OptionType,
} from 'src/constants/articleProps';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { useOutsideClickCloseArticle } from './hooks/useOutsideClickCloseArticle';

type ArticleParamsFormProps = {
	onChange: (state: ArticleStateType) => void;
	onReset: () => void;
};

/**
 * компонент сайд бара
 */

export const ArticleParamsForm = ({
	onChange,
	onReset,
}: ArticleParamsFormProps): React.JSX.Element => {
	const [formState, setFormState] = useState<ArticleStateType>({
		fontFamilyOption: fontFamilyOptions[0],
		fontSizeOption: fontSizeOptions[0],
		fontColor: fontColors[0],
		backgroundColor: backgroundColors[0],
		contentWidth: contentWidthArr[0],
	});
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const rootRef = useRef<HTMLElement>(null);

	useOutsideClickCloseArticle({
		isOpen: isMenuOpen,
		rootRef,
		onClose: setIsMenuOpen,
	});

	const handleOpenBtnClick = () => setIsMenuOpen((isMenuOpen) => !isMenuOpen);

	const handleFormChange = (key: keyof ArticleStateType, value: OptionType) =>
		setFormState((prev) => ({ ...prev, [key]: value }));

	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();
		onChange(formState);
	};

	const handleReset = () => {
		setFormState({
			fontFamilyOption: fontFamilyOptions[0],
			fontSizeOption: fontSizeOptions[0],
			fontColor: fontColors[0],
			backgroundColor: backgroundColors[0],
			contentWidth: contentWidthArr[0],
		});
		onReset();
	};

	return (
		<>
			<ArrowButton isOpen={isMenuOpen} onClick={handleOpenBtnClick} />
			<aside
				className={clsx(styles.container, isMenuOpen && styles.container_open)}
				ref={rootRef}>
				<form className={styles.form} onSubmit={handleApply}>
					<Text as='h2' size={31} weight={800} uppercase dynamicLite>
						Задайте параметры
					</Text>

					<Select
						selected={formState.fontFamilyOption}
						onChange={(value) => handleFormChange('fontFamilyOption', value)}
						options={fontFamilyOptions}
						title='Шрифт'
					/>

					<RadioGroup
						selected={formState.fontSizeOption}
						title='размер шрифта'
						name='radio'
						options={fontSizeOptions}
						onChange={(value) => handleFormChange('fontSizeOption', value)}
					/>

					<Select
						selected={formState.fontColor}
						onChange={(value) => handleFormChange('fontColor', value)}
						options={fontColors}
						title='Цвет шрифта'
					/>

					<Separator />

					<Select
						selected={formState.backgroundColor}
						onChange={(value) => handleFormChange('backgroundColor', value)}
						options={backgroundColors}
						title='Цвет фона'
					/>

					<Select
						selected={formState.contentWidth}
						onChange={(value) => handleFormChange('contentWidth', value)}
						options={contentWidthArr}
						title='Ширина контента'
					/>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
