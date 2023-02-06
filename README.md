# Stability Rest Client

This is a rest client to interface with Stability.ai's API.
As this requires an API key, server-side usage is recommended.

> ⚠️ This is a work in progress. Stability.ai Rest API is still in beta and is subject to change.

## Installation

```
$ npm install stability-rest
```

## Usage

### Typescript

```ts
import {
  ClipGuidancePreset,
  GenerationSampler,
  StabilityClient,
  WellKnownEngine,
} from "stability-rest";
import * as fs from "fs";

const client = new StabilityClient(process.env.STABILITY_API_KEY);

client.generation
  .textToImagePng(
    WellKnownEngine["stable-diffusion-512-v2-1"],
    "a pale blue planet in the depth of the space",
    {
      width: 512,
      height: 512,
      cfg_scale: 7.0,
      sampler: GenerationSampler.K_EULER_ANCESTRAL,
      clip_guidance_preset: ClipGuidancePreset.FAST_BLUE,
      steps: 20,
      samples: 1,
      seed: 10,
    }
  )
  .then((response) => {
    fs.writeFileSync("out.png", response.data);
  });
```

### Javascript

```js
const {
  StabilityClient,
  WellKnownEngine,
  GenerationSampler,
  ClipGuidancePreset,
} = require("stability-rest");
const fs = require("fs");

const client = new StabilityClient(process.env.STABILITY_API_KEY);

client.generation
  .textToImagePng(
    WellKnownEngine["stable-diffusion-512-v2-1"],
    "a pale blue planet in the depth of the space",
    {
      width: 512,
      height: 512,
      seed: 123,
      cfg_scale: 7.0,
      sampler: GenerationSampler.K_EULER_ANCESTRAL,
      clip_guidance_preset: ClipGuidancePreset.FAST_BLUE,
      steps: 20,
      samples: 1,
    }
  )
  .then((response) => {
    fs.writeFileSync("out.png", response.data);
  });
```

## API

This client maps 1-1 with the Stability API.
For more information, please refer to the [API documentation](https://api.stability.ai/docs).

```ts
const client = new StabilityClient(process.env.STABILITY_API_KEY);

// UserResource
client.user.account(); // GET /user/account
client.user.balance(); // GET /user/balance

// EngineResource
client.engine.list(); // GET /engines/list

// GenerationResource
client.generation.textToImage(engineId, prompt, options); // POST /generation/:engineId/text-to-image

client.generation.textToImagePng(engineId, prompt, options); // POST /generation/:engineId/text-to-image - this one returns an arraybuffer.
```

### Helpers

#### `getArtifactBuffer(artifact)`

Convert an artifact base64 string to a buffer.

#### `WellKnownEngine`

A list of well-known engines. This might be outdated as it is
statically defined. You can also call `StablityClient.engine.list()`
to get a list of all engines.

## Contributing

Contributions are welcome! Please open an issue or PR. There are no
guidelines yet, but please follow the existing code style.

### TODO

List of things that need to be done:

- [ ] Match v1.0.0 of the API once it is released.
- [ ] Improve tests, checks for schema equality, etc.
- [ ] Refactor, removing duplicates code.
- [ ] Multiple prompts with different weights.
- [ ] Prompt builder.

### Environment Setup

1. Clone the repo
2. Install dependencies 3. Create a `.env` file with your API key. Set the key as `STABILITY_API_KEY`.
3. Make contributions
4. Run tests <sup>[1]</sup>

```sh
$ npm run test
```

Then create a PR once all the tests pass.

### Important Notes on Tests <sup>1</sup>

We do not mock the API calls in the tests. This is to ensure that
the client is working as expected. However, this means that you
need to have a valid API key to run the tests.

> ⚠️ Please do not use your production API key to run the tests.
> You can create a new API key in [DreamStudio](https://beta.dreamstudio.ai/membership?tab=apiKeys).
> Running the tests might consume your API quota.

## License

MIT © Aditya Purwa
