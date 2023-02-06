import StabilityClient from "./StabilityClient";
import * as fs from "fs";
import * as path from "path";
import {
  ClipGuidancePreset,
  GenerationSampler,
  MaskSource,
} from "./GenerationResource";
import { AxiosError } from "axios";

/*
IMPORTANT: THIS TEST CONSUME CREDITS.
We try to keep the number of credits consumed low.
 */

describe("StabilityClient", function () {
  const client = new StabilityClient(process.env.STABILITY_API_KEY);

  it("should do text-to-image", function (done) {
    client.generation
      .textToImage(
        "stable-diffusion-512-v2-1",
        "a pale blue planet in the depth of the space, nebulae floating around, 3d render, global illumination, cg art, illustration, raytracing, redshift, octane render",
        {
          cfg_scale: 7,
          width: 512,
          height: 512,
          steps: 10,
        }
      )
      .then((response) => {
        response.data.artifacts.forEach((art) => {
          fs.writeFileSync(
            path.resolve("test-artifacts", `${art.seed}.png`),
            Buffer.from(art.base64, "base64")
          );
        });
        done();
      });
  }, 60000);
  it("should do text-to-image PNG", function (done) {
    client.generation
      .textToImagePng(
        "stable-diffusion-512-v2-1",
        "a pale blue planet in the depth of the space, nebulae floating around, 3d render, global illumination, cg art, illustration, raytracing, redshift, octane render",
        {
          cfg_scale: 7,
          width: 512,
          height: 512,
          steps: 10,
        }
      )
      .then((response) => {
        fs.writeFileSync(
          path.resolve("test-artifacts", `${new Date().getTime()}.png`),
          response.data
        );
        done();
      });
  }, 60000);

  it("should do image-to-image", function (done) {
    client.generation
      .imageToImage(
        "stable-diffusion-512-v2-1",
        "the moon made of cheese and marshmallow floating in the space, 3d render, global illumination, cg art, illustration, raytracing, redshift, octane render",
        fs.readFileSync(path.resolve("test-samples", "1.png")),
        0.1,
        {
          cfg_scale: 7,
          width: 512,
          height: 512,
          steps: 12,
        }
      )
      .then((response) => {
        response.data.artifacts.forEach((art) => {
          fs.writeFileSync(
            path.resolve("test-artifacts", `${art.seed}.png`),
            Buffer.from(art.base64, "base64")
          );
        });
        done();
      });
  }, 60000);

  it("should do image-to-image PNG", function (done) {
    client.generation
      .imageToImagePng(
        "stable-diffusion-512-v2-1",
        "the moon made of cheese and marshmallow floating in the space, 3d render, global illumination, cg art, illustration, raytracing, redshift, octane render",
        fs.readFileSync(path.resolve("test-samples", "1.png")),
        0.1,
        {
          cfg_scale: 7,
          width: 512,
          height: 512,
          steps: 12,
        }
      )
      .then((response) => {
        fs.writeFileSync(
          path.resolve("test-artifacts", `${new Date().getTime()}.png`),
          response.data
        );
        done();
      });
  }, 60000);

  it("should do image-to-image/masking", function (done) {
    client.generation
      .imageToImageMasking(
        "stable-diffusion-512-v2-1",
        "saturn with the ring made of popcorn and cookies, 3d render, global illumination, cg art, illustration, raytracing, redshift, octane render",
        fs.readFileSync(path.resolve("test-samples", "1.png")),
        fs.readFileSync(path.resolve("test-samples", "mask.png")),
        MaskSource.MASK_IMAGE_WHITE,
        {
          cfg_scale: 7,
          width: 512,
          height: 512,
          steps: 16,
          clip_guidance_preset: ClipGuidancePreset.FAST_BLUE,
          sampler: GenerationSampler.K_EULER_ANCESTRAL,
        }
      )
      .then((response) => {
        response.data.artifacts.forEach((art) => {
          fs.writeFileSync(
            path.resolve("test-artifacts", `${art.seed}.png`),
            Buffer.from(art.base64, "base64")
          );
        });
        done();
      })
      .catch((e) => {
        console.error((e as AxiosError).response?.data);
        done();
      });
  }, 60000);

  it("should do image-to-image/masking PNG", function (done) {
    client.generation
      .imageToImageMaskingPng(
        "stable-diffusion-512-v2-1",
        "saturn with the ring made of popcorn and cookies, 3d render, global illumination, cg art, illustration, raytracing, redshift, octane render",
        fs.readFileSync(path.resolve("test-samples", "1.png")),
        fs.readFileSync(path.resolve("test-samples", "mask.png")),
        MaskSource.MASK_IMAGE_WHITE,
        {
          cfg_scale: 7,
          width: 512,
          height: 512,
          steps: 16,
          clip_guidance_preset: ClipGuidancePreset.FAST_BLUE,
          sampler: GenerationSampler.K_EULER_ANCESTRAL,
        }
      )
      .then((response) => {
        fs.writeFileSync(
          path.resolve("test-artifacts", `${new Date().getTime()}.png`),
          response.data
        );
        done();
      })
      .catch((e) => {
        console.error((e as AxiosError).response?.data);
        done();
      });
  }, 60000);
});
