// @flow

import React from 'react';

import { blocks, i18n } from '../wp';

import SVGIcon from '../components/Logo/Logo';
import Inserter from '../components/Inserter/Inserter';

const { registerBlockType } = blocks;
const { __ } = i18n;

registerBlockType('ab-testing-for-wp/ab-test-block-inserter', {
  title: __('A/B Test'),
  icon: SVGIcon,
  category: 'widgets',
  edit() {
    return (
      <Inserter />
    );
  },
  save() {
    return <div>Test</div>;
  },
});
