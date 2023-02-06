import StabilityClient from "./StabilityClient";
import FormData = require("form-data");

export enum ClipGuidancePreset {
  FAST_BLUE = "FAST_BLUE",
  FAST_GREEN = "FAST_GREEN",
  NONE = "NONE",
  SIMPLE = "SIMPLE",
  SLOW = "SLOW",
  SLOWER = "SLOWER",
  SLOWEST = "SLOWEST",
}

export enum GenerationSampler {
  DDIM = "DDIM",
  DDPM = "DDPM",
  K_DPMPP_2M = "K_DPMPP_2M",
  K_DPMPP_2S_ANCESTRAL = "K_DPMPP_2S_ANCESTRAL",
  K_DPM_2 = "K_DPM_2",
  K_DPM_2_ANCESTRAL = "K_DPM_2_ANCESTRAL",
  K_EULER = "K_EULER",
  K_EULER_ANCESTRAL = "K_EULER_ANCESTRAL",
  K_HEUN = "K_HEUN",
  K_LMS = "K_LMS",
}

export interface GenerationOptions {
  cfg_scale: number;
  clip_guidance_preset: ClipGuidancePreset;
  height: number;
  width: number;
  samples: number;
  steps: number;
  sampler?: GenerationSampler;
}

export enum FinishReason {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  CONTENT_FILTERED = "CONTENT_FILTERED",
}

export interface GenerationArtifact {
  base64: string;
  seed: number;
  finishReason: FinishReason;
}

export interface GenerationResponse {
  artifacts: GenerationArtifact[];
}

export enum MaskSource {
  MASK_IMAGE_WHITE = "MASK_IMAGE_WHITE",
  MASK_IMAGE_BLACK = "MASK_IMAGE_BLACK",
  INIT_IMAGE_ALPHA = "INIT_IMAGE_ALPHA",
}

/**
 * Interface to access the /generation resource.
 */
export default class GenerationResource {
  /**
   * Initialize a new instance of GenerationResource. You probably want to use the StabilityClient instead.
   * @param client
   */
  constructor(private readonly client: StabilityClient) {}

  /**
   * Generate an image from a text prompt and yields the result as an GenerationArtifact.
   * @param engineId - the engine to use. You can use the helpers/engine.ts:WellKnownEngine to get a list of well-known engines or call EngineResource.list.
   * @param prompt - the text prompt to use
   * @param cfg_scale - the strength of the prompt, default is 7
   * @param clip_guidance_preset - the type of guidance to use, default is ClipGuidancePreset.FAST_BLUE
   * @param height - the height of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param width - the width of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param samples - the number of samples to generate, default is 1
   * @param steps - the number of steps to generate, default is 20. The higher the step, the longer it will take to generate the image.
   * @param sampler - the sampler to use, default is null. See GenerationSampler for a list of available samplers.
   */
  public textToImage(
    engineId: string,
    prompt: string,
    {
      cfg_scale = 7,
      clip_guidance_preset = ClipGuidancePreset.FAST_BLUE,
      height = 512,
      width = 512,
      samples = 1,
      steps = 20,
      sampler = null,
    }: Partial<GenerationOptions> = {}
  ) {
    return this.client.http.post<GenerationResponse>(
      `generation/${engineId}/text-to-image`,
      {
        text_prompts: [
          {
            text: prompt,
          },
        ],
        cfg_scale,
        clip_guidance_preset,
        height,
        width,
        samples,
        steps,
        sampler,
      }
    );
  }

  /**
   * Generate an image from a text prompt and yields the result as PNG.
   * @param engineId - the engine to use. You can use the helpers/engine.ts:WellKnownEngine to get a list of well-known engines or call EngineResource.list.
   * @param prompt - the text prompt to use
   * @param cfg_scale - the strength of the prompt, default is 7
   * @param clip_guidance_preset - the type of guidance to use, default is ClipGuidancePreset.FAST_BLUE
   * @param height - the height of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param width - the width of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param samples - the number of samples to generate, default is 1
   * @param steps - the number of steps to generate, default is 20. The higher the step, the longer it will take to generate the image.
   * @param sampler - the sampler to use, default is null. See GenerationSampler for a list of available samplers.
   */
  public textToImagePng(
    engineId: string,
    prompt: string,
    {
      cfg_scale = 7,
      clip_guidance_preset = ClipGuidancePreset.FAST_BLUE,
      height = 512,
      width = 512,
      samples = 1,
      steps = 20,
      sampler = null,
    }: Partial<GenerationOptions> = {}
  ) {
    return this.client.http.post<Buffer>(
      `generation/${engineId}/text-to-image`,
      {
        text_prompts: [
          {
            text: prompt,
          },
        ],
        cfg_scale,
        clip_guidance_preset,
        height,
        width,
        samples,
        steps,
        sampler,
      },
      {
        responseType: "arraybuffer",
        headers: {
          Accept: "image/png",
        },
      }
    );
  }

  /**
   * Generate an image from a text prompt and an initial image and yields the result as an GenerationArtifact.
   * @param engineId - the engine to use. You can use the helpers/engine.ts:WellKnownEngine to get a list of well-known engines or call EngineResource.list.
   * @param prompt - the text prompt to use
   * @param image - the initial image to use
   * @param imageStrength - the strength of the initial image, default is 0.35
   * @param cfg_scale - the strength of the prompt, default is 7
   * @param clip_guidance_preset - the type of guidance to use, default is ClipGuidancePreset.FAST_BLUE
   * @param height - the height of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param width - the width of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param samples - the number of samples to generate, default is 1
   * @param steps - the number of steps to generate, default is 20. The higher the step, the longer it will take to generate the image.
   * @param sampler - the sampler to use, default is null. See GenerationSampler for a list of available samplers.
   */
  public imageToImage(
    engineId: string,
    prompt: string,
    image: Buffer,
    imageStrength: number = 0.35,
    {
      cfg_scale = 7,
      clip_guidance_preset = ClipGuidancePreset.FAST_BLUE,
      height = 512,
      width = 512,
      samples = 1,
      steps = 10,
      sampler = null,
    }: Partial<GenerationOptions> = {}
  ) {
    const formData = new FormData();
    formData.append("init_image", image);
    formData.append("text_prompts[0][text]", prompt);
    formData.append("image_strength", prompt);
    formData.append("cfg_scale", cfg_scale);
    formData.append("clip_guidance_preset", clip_guidance_preset);
    formData.append("height", height);
    formData.append("width", width);
    formData.append("samples", samples);
    formData.append("steps", steps);
    if (sampler) {
      formData.append("sampler", sampler);
    }
    return this.client.http.post<GenerationResponse>(
      `generation/${engineId}/image-to-image`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
  }

  /**
   * Generate an image from a text prompt and an initial image and yields the result as a PNG.
   * @param engineId - the engine to use. You can use the helpers/engine.ts:WellKnownEngine to get a list of well-known engines or call EngineResource.list.
   * @param prompt - the text prompt to use
   * @param image - the initial image to use
   * @param imageStrength - the strength of the initial image, default is 0.35
   * @param cfg_scale - the strength of the prompt, default is 7
   * @param clip_guidance_preset - the type of guidance to use, default is ClipGuidancePreset.FAST_BLUE
   * @param height - the height of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param width - the width of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param samples - the number of samples to generate, default is 1
   * @param steps - the number of steps to generate, default is 20. The higher the step, the longer it will take to generate the image.
   * @param sampler - the sampler to use, default is null. See GenerationSampler for a list of available samplers.
   */
  public imageToImagePng(
    engineId: string,
    prompt: string,
    image: Buffer,
    imageStrength: number = 0.35,
    {
      cfg_scale = 7,
      clip_guidance_preset = ClipGuidancePreset.FAST_BLUE,
      height = 512,
      width = 512,
      samples = 1,
      steps = 10,
      sampler = null,
    }: Partial<GenerationOptions> = {}
  ) {
    const formData = new FormData();
    formData.append("init_image", image);
    formData.append("text_prompts[0][text]", prompt);
    formData.append("image_strength", prompt);
    formData.append("cfg_scale", cfg_scale);
    formData.append("clip_guidance_preset", clip_guidance_preset);
    formData.append("height", height);
    formData.append("width", width);
    formData.append("samples", samples);
    formData.append("steps", steps);
    if (sampler) {
      formData.append("sampler", sampler);
    }
    return this.client.http.post<Buffer>(
      `generation/${engineId}/image-to-image`,
      formData,
      {
        responseType: "arraybuffer",
        headers: {
          ...formData.getHeaders(),
          Accept: "image/png",
        },
      }
    );
  }

  /**
   * Generate an image from a text prompt and an initial image with masking and yields the result as an GenerationArtifact.
   * @param engineId - the engine to use. You can use the helpers/engine.ts:WellKnownEngine to get a list of well-known engines or call EngineResource.list.
   * @param prompt - the text prompt to use
   * @param image - the initial image to use
   * @param maskImage  - the mask image to use
   * @param maskSource - the mask mode to use, default is MaskSource.MASK_IMAGE_WHITE
   * @param cfg_scale - the strength of the prompt, default is 7
   * @param clip_guidance_preset - the type of guidance to use, default is ClipGuidancePreset.FAST_BLUE
   * @param height - the height of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param width - the width of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param samples - the number of samples to generate, default is 1
   * @param steps - the number of steps to generate, default is 20. The higher the step, the longer it will take to generate the image.
   * @param sampler - the sampler to use, default is null. See GenerationSampler for a list of available samplers.
   */
  public imageToImageMasking(
    engineId: string,
    prompt: string,
    image: Buffer,
    maskImage: Buffer,
    maskSource: MaskSource = MaskSource.MASK_IMAGE_WHITE,
    {
      cfg_scale = 7,
      clip_guidance_preset = ClipGuidancePreset.FAST_BLUE,
      height = 512,
      width = 512,
      samples = 1,
      steps = 10,
      sampler = null,
    }: Partial<GenerationOptions> = {}
  ) {
    const formData = new FormData();
    formData.append("init_image", image);
    formData.append("text_prompts[0][text]", prompt);
    formData.append("mask_image", maskImage);
    formData.append("mask_source", maskSource);
    formData.append("cfg_scale", cfg_scale);
    formData.append("clip_guidance_preset", clip_guidance_preset);
    formData.append("height", height);
    formData.append("width", width);
    formData.append("samples", samples);
    formData.append("steps", steps);
    if (sampler) {
      formData.append("sampler", sampler);
    }
    return this.client.http.post<GenerationResponse>(
      `generation/${engineId}/image-to-image/masking`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
  }

  /**
   * Generate an image from a text prompt and an initial image with masking and yields the result as a PNG.
   * @param engineId - the engine to use. You can use the helpers/engine.ts:WellKnownEngine to get a list of well-known engines or call EngineResource.list.
   * @param prompt - the text prompt to use
   * @param image - the initial image to use
   * @param maskImage  - the mask image to use
   * @param maskSource - the mask mode to use, default is MaskSource.MASK_IMAGE_WHITE
   * @param cfg_scale - the strength of the prompt, default is 7
   * @param clip_guidance_preset - the type of guidance to use, default is ClipGuidancePreset.FAST_BLUE
   * @param height - the height of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param width - the width of the image, default is 512. The height and width a multiple of 64. The larger the image, the longer it will take to generate the image.
   * @param samples - the number of samples to generate, default is 1
   * @param steps - the number of steps to generate, default is 20. The higher the step, the longer it will take to generate the image.
   * @param sampler - the sampler to use, default is null. See GenerationSampler for a list of available samplers.
   */
  public imageToImageMaskingPng(
    engineId: string,
    prompt: string,
    image: Buffer,
    maskImage: Buffer,
    maskSource: MaskSource = MaskSource.MASK_IMAGE_WHITE,
    {
      cfg_scale = 7,
      clip_guidance_preset = ClipGuidancePreset.FAST_BLUE,
      height = 512,
      width = 512,
      samples = 1,
      steps = 10,
      sampler = null,
    }: Partial<GenerationOptions> = {}
  ) {
    const formData = new FormData();
    formData.append("init_image", image);
    formData.append("text_prompts[0][text]", prompt);
    formData.append("mask_image", maskImage);
    formData.append("mask_source", maskSource);
    formData.append("cfg_scale", cfg_scale);
    formData.append("clip_guidance_preset", clip_guidance_preset);
    formData.append("height", height);
    formData.append("width", width);
    formData.append("samples", samples);
    formData.append("steps", steps);
    if (sampler) {
      formData.append("sampler", sampler);
    }
    return this.client.http.post<Buffer>(
      `generation/${engineId}/image-to-image/masking`,
      formData,
      {
        responseType: "arraybuffer",
        headers: {
          ...formData.getHeaders(),
          Accept: "image/png",
        },
      }
    );
  }
}
