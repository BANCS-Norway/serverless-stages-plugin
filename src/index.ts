interface ServerlessInstance {
  service: {
    provider: { stage: string };
    custom?: Record<string, unknown>;
  };
}

interface ServerlessOptions {
  stage?: string | null;
}

export class StagesPlugin {
  private serverless: ServerlessInstance;
  private options: ServerlessOptions;
  hooks: Record<string, () => void>;

  constructor(serverless: ServerlessInstance, options: ServerlessOptions) {
    this.serverless = serverless;
    this.options = options;
    this.hooks = {
      "before:package:initialize": () => this.checkStage(),
      "before:deploy:function:initialize": () => this.checkStage(),
    };
  }

  checkStage(): void {
    const stage = this.options.stage
      ? this.options.stage
      : this.serverless.service.provider.stage;

    const {
      service: { custom: { stages: raw = [] } = { stages: [] } } = {
        custom: { stages: [] },
      },
    } = this.serverless;

    const stages =
      typeof raw === "string"
        ? [raw]
        : Array.isArray(raw)
          ? raw.filter((s): s is string => typeof s === "string")
          : [];

    if (stages.length === 0) {
      throw new Error(
        `A "stages" array must be defined in your serverless.yml's "custom" section.`,
      );
    }

    if (!stages.includes(stage)) {
      throw new Error(
        `'${stage}' is not a valid deployment stage. Add it to your serverless.yml's "custom.stages" section.`,
      );
    }
  }
}

export default StagesPlugin;
