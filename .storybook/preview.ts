import type { Preview } from '@storybook/react';
import { StoryDecorator } from '../src/ui/story-decorator/StoryDecorator';

/**
 * настройка препространство для storybook
 * он настраивает поведение storybook для всех историй включая параметры и декараторы
 */

const preview: Preview = {
	parameters: {
		// глобальные параметры storybook
		actions: { argTypesRegex: '^on[A-Z].*' }, // автоматическое отслеживание событий

		// автоматичиское создание контроллеров для отслеживания событий
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [StoryDecorator],
};

export default preview;
