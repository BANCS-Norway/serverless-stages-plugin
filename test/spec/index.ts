import { expect } from 'chai';
import { StagesPlugin } from '../../src/index.js';

function makeServerless(opts: {
  providerStage?: string;
  stages?: string | string[] | number;
  omitCustom?: boolean;
}) {
  return {
    service: {
      provider: {
        stage: opts.providerStage ?? 'dev',
      },
      ...(opts.omitCustom ? {} : {
        custom: opts.stages !== undefined ? { stages: opts.stages } : {},
      }),
    },
  };
}

describe('StagesPlugin', () => {
  describe('constructor', () => {
    it('assigns serverless and options and exposes hooks', () => {
      const plugin = new StagesPlugin(makeServerless({ stages: ['dev'] }), {});
      expect(plugin.hooks).to.be.an('object');
    });

    it('hook before:package:initialize calls checkStage()', () => {
      const plugin = new StagesPlugin(
        makeServerless({ providerStage: 'dev', stages: ['dev'] }),
        {}
      );
      expect(() => plugin.hooks['before:package:initialize']()).not.to.throw();
    });

    it('hook before:deploy:function:initialize calls checkStage()', () => {
      const plugin = new StagesPlugin(
        makeServerless({ providerStage: 'dev', stages: ['dev'] }),
        {}
      );
      expect(() => plugin.hooks['before:deploy:function:initialize']()).not.to.throw();
    });
  });

  describe('checkStage()', () => {
    it('throws when custom section is absent', () => {
      const plugin = new StagesPlugin(makeServerless({ omitCustom: true }), {});
      expect(() => plugin.checkStage()).to.throw(
        'A "stages" array must be defined in your serverless.yml\'s "custom" section.'
      );
    });

    it('throws when custom.stages is not defined', () => {
      const plugin = new StagesPlugin(makeServerless({}), {});
      expect(() => plugin.checkStage()).to.throw(
        'A "stages" array must be defined in your serverless.yml\'s "custom" section.'
      );
    });

    it('throws when custom.stages is an empty array', () => {
      const plugin = new StagesPlugin(makeServerless({ stages: [] }), {});
      expect(() => plugin.checkStage()).to.throw(
        'A "stages" array must be defined in your serverless.yml\'s "custom" section.'
      );
    });

    it('throws when custom.stages is an invalid type', () => {
      const plugin = new StagesPlugin(makeServerless({ stages: 123 as unknown as string }), {});
      expect(() => plugin.checkStage()).to.throw(
        'A "stages" array must be defined in your serverless.yml\'s "custom" section.'
      );
    });

    it('throws when stage is not in the allowed list', () => {
      const plugin = new StagesPlugin(
        makeServerless({ providerStage: 'prod', stages: ['dev', 'staging'] }),
        {}
      );
      expect(() => plugin.checkStage()).to.throw(
        "'prod' is not a valid deployment stage."
      );
    });

    it('passes when stage is in the allowed list', () => {
      const plugin = new StagesPlugin(
        makeServerless({ providerStage: 'dev', stages: ['dev', 'prod'] }),
        {}
      );
      expect(() => plugin.checkStage()).not.to.throw();
    });

    it('resolves stage from --stage CLI option', () => {
      const plugin = new StagesPlugin(
        makeServerless({ providerStage: 'dev', stages: ['dev', 'prod'] }),
        { stage: 'prod' }
      );
      expect(() => plugin.checkStage()).not.to.throw();
    });

    it('throws when --stage CLI option is not in the allowed list', () => {
      const plugin = new StagesPlugin(
        makeServerless({ providerStage: 'dev', stages: ['dev', 'prod'] }),
        { stage: 'qa' }
      );
      expect(() => plugin.checkStage()).to.throw(
        "'qa' is not a valid deployment stage."
      );
    });

    it('falls back to provider.stage when no --stage option is given', () => {
      const plugin = new StagesPlugin(
        makeServerless({ providerStage: 'staging', stages: ['staging'] }),
        {}
      );
      expect(() => plugin.checkStage()).not.to.throw();
    });

    it('accepts stages as a single string value', () => {
      const plugin = new StagesPlugin(
        makeServerless({ providerStage: 'prod', stages: 'prod' }),
        {}
      );
      expect(() => plugin.checkStage()).not.to.throw();
    });

    it('accepts stages as an array value', () => {
      const plugin = new StagesPlugin(
        makeServerless({ providerStage: 'prod', stages: ['dev', 'prod'] }),
        {}
      );
      expect(() => plugin.checkStage()).not.to.throw();
    });

    it('registers before:package:initialize and before:deploy:function:initialize hooks', () => {
      const plugin = new StagesPlugin(makeServerless({ stages: ['dev'] }), {});
      expect(plugin.hooks).to.have.property('before:package:initialize');
      expect(plugin.hooks).to.have.property('before:deploy:function:initialize');
    });
  });
});
