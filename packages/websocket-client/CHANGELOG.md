# @effection/websocket-client

## \[2.0.3]

- Remove redundant node-fetch from dependencies
  - Bumped due to a bump in effection.
  - [b4a87d5](https://github.com/thefrontside/effection/commit/b4a87d525d270e53b92543676c9fb10c7fd1edd7) Add change file for covector on 2022-01-24

## \[2.0.2]

- Extract `AbortSignal` from `@effection/fetch` to `@effection/core` as a resource
  - Bumped due to a bump in effection.
  - [8ac2e85](https://github.com/thefrontside/effection/commit/8ac2e8515ac2cb1ee6ed5a200f31d28024bfdae2) Add covector change file on 2021-11-18
  - [b6d0e15](https://github.com/thefrontside/effection/commit/b6d0e1502ca8345bf488aef695b16fe7a5a5945d) Patch for fetch and not minor on 2021-11-19

## \[2.0.1]

- workaround borked 2.0 release https://status.npmjs.org/incidents/wy4002vc8ryc
  - Bumped due to a bump in effection.
  - [97711a7](https://github.com/thefrontside/effection/commit/97711a77419c8e539bff3060a9f3c1bae947f9b8) Work around borked NPM release on 2021-10-12

## \[2.0.0]

- Release Effection 2.0.0
  - [8bd89ad](https://github.com/thefrontside/effection/commit/8bd89ad40e42805ab6da0fd1b7a49beed9769865) Add 2.0 changeset on %as

## \[2.0.0-beta.22]

- Yielding to something which is not an operation no longer throws an internal error, but properly rejects the task.
  - Bumped due to a bump in @effection/core.
  - [a3ad19a](https://github.com/thefrontside/effection/commit/a3ad19a3177a731fee5cd2389ab898dee7b1788e) Fix yielding non operation bug on 2021-10-07

## \[2.0.0-beta.21]

- Fix a bug when using blockParent where the children are not getting halt on an explicit halt.
  - Bumped due to a bump in @effection/core.
  - [1cd9803](https://github.com/thefrontside/effection/commit/1cd98033d2641989114f9589c7d887954fa66781) Fix halting children for blockParent tasks on 2021-09-30

## \[2.0.0-beta.20]

- Add Stream `toBuffer` and Stream `buffered` so we have both options on either accessing the buffer directly or returning the stream.
  - Bumped due to a bump in @effection/events.
  - [fe60532](https://github.com/thefrontside/effection/commit/fe60532c3f8cfdd8b53c324b7ea8e38e437f080f) Add both toBuffer and buffered to Stream on 2021-09-30

## \[2.0.0-beta.19]

- Stream `buffer` returns the actual buffer and gives direct access to it
  - Bumped due to a bump in @effection/events.
  - [07c8f83](https://github.com/thefrontside/effection/commit/07c8f83b5968f347ca72795c447be411e66274ed) Stream `buffer` returns the actual buffer on 2021-09-30

## \[2.0.0-beta.18]

- - [0248d79](https://github.com/thefrontside/effection/commit/0248d79a33dcfc4200b0832aba975c9cad08981e) Add package readmes on 2021-09-28

## \[2.0.0-beta.17]

- Adjust the propagation of errors for resources to make it possible to catch errors from `init`
  - Bumped due to a bump in @effection/core.
  - [75a7248](https://github.com/thefrontside/effection/commit/75a7248ae13d1126bbcaf9b6223f348168e987d0) Catch errors thrown during resource init on 2021-09-21
- Enable support for resources in higher order operations `all`, `race` and `withTimeout`.
  - Bumped due to a bump in @effection/core.
  - [bbe6cdc](https://github.com/thefrontside/effection/commit/bbe6cdc44184a7669278d0d01ad23a2a79a69e52) Enable resource support for higher order operations on 2021-09-09

## \[2.0.0-beta.16]

- Add shortcuts to create resolved/rejected/halted futures via Future.resolve(123), etc...
  - Bumped due to a bump in @effection/core.
  - [9599dde](https://github.com/thefrontside/effection/commit/9599dde14e9bc3ba4ac7ea473e8624164727be0c) Add shortcuts for resolves/rejected/halted future on 2021-09-08

## \[2.0.0-beta.15]

- Add @effection/fetch as a dependency and reexport it
  - Bumped due to a bump in @effection/core.
  - [5ab5d06](https://github.com/thefrontside/effection/commit/5ab5d0691af75f3583de97402b5aac12325e2918) Reexport @effection/fetch from effection package on 2021-08-26
- Share internal run loop among task, task future and task controller. Prevents race conditions which cause internal errors.
  - Bumped due to a bump in @effection/core.
  - [222d511](https://github.com/thefrontside/effection/commit/222d5116c388c5b597cc3ec5e0fb64b4d22b273a) Share event loop among controller, task and future on 2021-09-01
- Introduce task scope as an alternative to resources for being able to access the outer scope of an operation
  - Bumped due to a bump in @effection/core.
  - [3ed11bd](https://github.com/thefrontside/effection/commit/3ed11bd4f5d980cd130ea894a63acb57450c5aac) Make resource task accessible through init task on 2021-08-27
- Add `toString()` method to task for nicely formatted rendering of task structure
  - Bumped due to a bump in @effection/core.
  - [9a63928](https://github.com/thefrontside/effection/commit/9a6392836704ad527d6da5195f5736462d69bef8) Add toString output for tasks on 2021-08-31

## \[2.0.0-beta.14]

- Collapse subscription methods in the inspector by default.
  - Bumped due to a bump in @effection/subscription.
  - [0d7ec90](https://github.com/thefrontside/effection/commit/0d7ec90beea2a8feb26c133ca2d5bbcd1685db3c) Collapse subscriptions methods in the inspector on 2021-08-27

## \[2.0.0-beta.13]

- Update core dependency
  - Bumped due to a bump in @effection/mocha.
  - [d92eee5](https://github.com/thefrontside/effection/commit/d92eee594fdb8dc6d8ab6a37b6aa362122e63f6e) Update core dependency on 2021-08-16

## \[2.0.0-beta.12]

- Use Object.create to wrap error objects rather than copying properties
  - Bumped due to a bump in @effection/core.
  - [a56ae2a](https://github.com/thefrontside/effection/commit/a56ae2af8a6247697b8b6253bd35b6d9e569613d) Use Object.create to create error object with trace on 2021-08-16

## \[2.0.0-beta.11]

- add `Task#spawn` operation to spawn new task with a specific scope
  - Bumped due to a bump in @effection/core.
  - [a71d65b](https://github.com/thefrontside/effection/commit/a71d65b77df5c337a78b7934edd181080eacf5bf) Add changefile on 2021-07-27

## \[2.0.0-beta.10]

- Add sideEffects field to package.json
  - [383141d](https://github.com/thefrontside/effection/commit/383141dc556c6a781d98087f3b68085d5eb31173) Add sideEffects field to package.json ([#470](https://github.com/thefrontside/effection/pull/470)) on 2021-08-05

## \[2.0.0-beta.9]

- The `dist` directory didn't contain the `esm` and `cjs` directory. We copy the `package.json` for reference into the dist, and this broke the `files` resolution. Switch to using `dist-cjs` and `dist-esm` which allows us to avoid copying `package.json`.
  - [63fbcfb](https://github.com/thefrontside/effection/commit/63fbcfb8151bb7434f1cb8c58bfed25012ad2727) fix: @effection/core to ship dist/esm and dist/cjs on 2021-08-03
  - [7788e24](https://github.com/thefrontside/effection/commit/7788e2408bcff8180b24ce497043283c97b6dbaa) fix: @effection/core to ship dist-esm and dist-cjs on 2021-08-03
  - [6923a0f](https://github.com/thefrontside/effection/commit/6923a0fa1a84cd0788f8c9c1600ccf7539b08bbf) update change file with everything patched on 2021-08-03

## \[2.0.0-beta.8]

- Add esm builds
  - Bumped due to a bump in @effection/core.
  - [6660a46](https://github.com/thefrontside/effection/commit/6660a466a50c9b9c36829c2d52448ebbc0e7e6fb) Add esm build ([#462](https://github.com/thefrontside/effection/pull/462)) on 2021-08-03

## \[2.0.0-beta.7]

- remove accidentally compiled .js files from distributed sources
  - Bumped due to a bump in @effection/mocha.
  - [f0f0023](https://github.com/thefrontside/effection/commit/f0f002354743ae6d6f69bfe6df28ddc11d0f8be0) add changefile on 2021-07-26

## \[2.0.0-beta.6]

- Upgrade typescript to 4.3.5 and replace tsdx with tsc
  - [121bd40](https://github.com/thefrontside/effection/commit/121bd40e17609a82bce649c5fed34ee0754681b7) Add change file for typescript bump on 2021-07-23

## 2.0.0-beta.5

### Patch Changes

- Updated dependencies \[e297c86]
  - @effection/core@2.0.0-beta.4
  - @effection/events@2.0.0-beta.4
  - @effection/subscription@2.0.0-beta.4

## 2.0.0-beta.4

### Patch Changes

- Updated dependencies \[3e77f29]
- Updated dependencies \[5d95e6d]
- Updated dependencies \[9700b45]
- Updated dependencies \[9700b45]
  - @effection/subscription@2.0.0-beta.3
  - @effection/events@2.0.0-beta.3
  - @effection/core@2.0.0-beta.3

## 2.0.0-beta.3

### Patch Changes

- Updated dependencies \[19414f0]
- Updated dependencies \[26a86cb]
- Updated dependencies \[9c76cc5]
- Updated dependencies \[f7e3344]
- Updated dependencies \[ac7c1ce]
  - @effection/core@2.0.0-beta.2
  - @effection/events@2.0.0-beta.2
  - @effection/subscription@2.0.0-beta.2

## 2.0.0-beta.2

### Minor Changes

- e621736: Fix esm module declarations in package.json

## 2.0.0-beta.1

### Patch Changes

- 0c6e263: release 2.0.0-beta
- Updated dependencies \[0c6e263]
  - @effection/core@2.0.0-beta.1
  - @effection/events@2.0.0-beta.1
  - @effection/subscription@2.0.0-beta.1

## 2.0.0-preview.3

### Patch Changes

- Updated dependencies \[9998088]
- Updated dependencies \[d7c0eb1]
- Updated dependencies \[2bce454]
- Updated dependencies \[1981b35]
- Updated dependencies \[88dc59a]
  - @effection/core@2.0.0-preview.12
  - @effection/events@2.0.0-preview.13
  - @effection/subscription@2.0.0-preview.14

## 2.0.0-preview.2

### Patch Changes

- Updated dependencies \[88eca21]
- Updated dependencies \[ae8d090]
- Updated dependencies \[8bb4514]
- Updated dependencies \[44c354d]
  - @effection/core@2.0.0-preview.11
  - @effection/events@2.0.0-preview.12
  - @effection/subscription@2.0.0-preview.13
