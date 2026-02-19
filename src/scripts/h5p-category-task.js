import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from '@components/Main.js';
import { CategoryTaskProvider } from './context/CategoryTaskContext.js';
import { sanitizeParams } from './components/utils.js';

export default class CategoryTask extends H5P.EventDispatcher {
  constructor(params, contentId, extras = {}) {
    super();

    const { language = 'en' } = extras;

    // TODO: Complete theming and styling
    // TODO: Fix keyboard
    // TODO: Fix draggable editing

    this.params = sanitizeParams(params);
    this.params.mode = 'category';

    this.behaviour = this.params.behaviour || {};
    this.resetStack = [];
    this.collectExportValuesStack = [];
    this.wrapper = null;
    this.id = contentId;
    this.language = language;
    this.activityStartTime = new Date();
    this.container = null;

    this.translations = Object.assign({}, {
      summary: 'Summary',
      typeYourReasonsForSuchAnswers: 'Type your reasons for such answers',
      resources: 'Resources',
      save: 'Save',
      restart: 'Restart',
      createDocument: 'Create document',
      labelSummaryComment: 'Summary comment',
      labelComment: 'Comment',
      labelStatement: 'Statement',
      labelNoComment: 'No comment',
      labelResources: 'Resources',
      selectAll: 'Select all',
      export: 'Export',
      addArgument: 'Add argument',
      ifYouContinueAllYourChangesWillBeLost: 'All the changes will be lost. Are you sure you wish to continue?',
      close: 'Close',
      drag: 'Drag',
      feedback: 'Feedback',
      submitText: 'Submit',
      submitConfirmedText: 'Saved!',
      confirm: 'Confirm',
      continue: 'Continue',
      cancel: 'Cancel',
      droparea: 'Droparea :num',
      emptydroparea: 'Empty droparea :index',
      draggableItem: 'Draggable item :statement',
      dropzone: 'Dropzone :index',
      dropzoneWithValue: 'Dropzone :index with value :statement',
      noArguments: 'No arguments',
      moveTo: 'Move to',
      deleteArgument: 'Delete argument',
      editArgument: 'Edit argument',
      argument: 'Argument',
      actionMenuTitle: 'Action menu',
      actionMenuDescription: 'Select the action you want to perform on this argument',
      dropArgumentsHere: 'Drop arguments here',
      availableActions: 'See available actions',
      argumentsFor: 'Arguments for',
      argumentsAgainst: 'Arguments against',
      showSolution: 'Show solution',
      headerSampleSolution: 'Sample solution'
    }, this.params.l10n, this.params.resourceReport);

    this.getRect = this.getRect.bind(this);
    this.reset = this.reset.bind(this);
    this.registerReset = this.registerReset.bind(this);
    this.collectExportValues = this.collectExportValues.bind(this);
    this.translate = this.translate.bind(this);
  }

  /**
   * Get sample solution if available.
   * @returns {object|null} Sample solution.
   */
  getSampleSolution() {
    const { sample, introduction } = this.params.solution;
    return sample ? { sample, explanation: introduction || '' } : null;
  }

  collectExportValues(index, callback) {
    if (typeof index !== 'undefined') {
      this.collectExportValuesStack.push({ key: index, callback: callback });
    }
    else {
      const exportValues = {};
      this.collectExportValuesStack.forEach(({ key, callback }) => exportValues[key] = callback());
      return exportValues;
    }
  }

  registerReset(callback) {
    this.resetStack.push(callback);
  }

  createElements() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('h5p-category-task-wrapper');
    this.wrapper = wrapper;

    const root = createRoot(wrapper);
    root.render(
      <CategoryTaskProvider value={this}>
        <Main
          {...this.params}
          id={this.id}
          language={this.language}
          collectExportValues={this.collectExportValues}
          showSolution={this.getSampleSolution.bind(this)}
        />
      </CategoryTaskProvider>
    );
  }

  attach($container) {
    if (!this.wrapper) {
      this.createElements();
    }

    // Append elements to DOM
    $container[0].appendChild(this.wrapper);
    $container[0].classList.add('h5p-category-task');
    this.container = $container[0];
  }

  getRect() {
    return this.wrapper.getBoundingClientRect();
  }

  reset() {
    this.resetStack.forEach((callback) => callback());
  }

  /**
   * Help fetch the correct translations.
   *
   * @params key
   * @params vars
   * @return {string}
   */
  translate(key, vars) {
    let translation = this.translations[key];
    if (vars !== undefined && vars !== null) {
      translation = Object
        .keys(vars)
        .map((key) => translation.replace(key, vars[key]))
        .toString();
    }
    return translation;
  }
}
