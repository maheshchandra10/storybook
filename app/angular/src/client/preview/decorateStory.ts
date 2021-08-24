import { DecoratorFunction, StoryContext, StoryContextUpdate, StoryFn } from '@storybook/csf';
import { computesTemplateFromComponent } from './angular-beta/ComputesTemplateFromComponent';

import { AngularFramework } from './types-6-0';

export default function decorateStory(
  mainStoryFn: StoryFn<AngularFramework>,
  decorators: DecoratorFunction<AngularFramework>[]
): StoryFn<AngularFramework> {
  const returnDecorators = [cleanArgsDecorator, ...decorators].reduce(
    (previousStoryFn: StoryFn<AngularFramework>, decorator) => (
      context: StoryContext<AngularFramework>
    ) => {
      const decoratedStory = decorator(
        ({ args, globals }: StoryContextUpdate = {} as StoryContextUpdate) => {
          return previousStoryFn({
            ...context,
            ...(args && { args }),
            ...(globals && { globals }),
          });
        },
        context
      );

      return decoratedStory;
    },
    (context) => prepareMain(mainStoryFn(context), context)
  );

  return returnDecorators;
}

const prepareMain = (
  story: AngularFramework['storyResult'],
  context: StoryContext<AngularFramework>
): AngularFramework['storyResult'] => {
  let { template } = story;

  const component = story.component ?? context.parameters.component;

  if (hasNoTemplate(template) && component) {
    template = computesTemplateFromComponent(component, story.props, '');
  }
  return {
    ...story,
    ...(template ? { template } : {}),
  };
};

function hasNoTemplate(template: string | null | undefined): template is undefined {
  return template === null || template === undefined;
}

const cleanArgsDecorator: DecoratorFunction<AngularFramework> = (storyFn, context) => {
  if (!context.argTypes || !context.args) {
    return storyFn();
  }

  const argsToClean = context.args;

  context.args = Object.entries(argsToClean).reduce((obj, [key, arg]) => {
    const argType = context.argTypes[key];

    // Only keeps args with a control or an action in argTypes
    if (argType.action || argType.control) {
      return { ...obj, [key]: arg };
    }
    return obj;
  }, {});

  return storyFn();
};
