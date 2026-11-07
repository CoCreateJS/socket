## [3.0.1](https://github.com/CoCreateJS/socket/compare/v3.0.0...v3.0.1) (2026-11-07)


### Bug Fixes

* bump CoCreate dependency versions ([ecf76e9](https://github.com/CoCreateJS/socket/commit/ecf76e9ca350177059d53d15d53ab6b8824332fd))

# [3.0.0](https://github.com/CoCreateJS/socket/compare/v2.0.1...v3.0.0) (2026-11-07)


### Bug Fixes

* apply socket identity to incoming messages ([b46e033](https://github.com/CoCreateJS/socket/commit/b46e033a1d624d11039c5d9659ddc2e562902569))
* complete unified socket package migration ([516758c](https://github.com/CoCreateJS/socket/commit/516758ce9371b237c42d44beaa180cc7a90b3250))
* emit unified organization presence transitions ([297c997](https://github.com/CoCreateJS/socket/commit/297c997a79bb786355637c89d84c1030820adbbf))
* preserve socket payload data ([9e629e3](https://github.com/CoCreateJS/socket/commit/9e629e3e42f0424f9a60bb3407c84be1f447431e))
* route component responses through unified server send ([e41e06f](https://github.com/CoCreateJS/socket/commit/e41e06f641c272a996c489e73791add5e834808f))
* route socket replies through server send ([837de15](https://github.com/CoCreateJS/socket/commit/837de151462569bef1f224dfa8b7d49126eef105))
* use cluster server id for socket origin ([b02accb](https://github.com/CoCreateJS/socket/commit/b02accb59c2f913f1fe7ee0d1e75d2eb9e2ab2e7))


### Features

* combine socket client and server in one package ([f3af263](https://github.com/CoCreateJS/socket/commit/f3af263b53a3c60ab7a2b92c0527c7b13fea9186))
* expose lifecycle-aware socket collections ([e71e5d1](https://github.com/CoCreateJS/socket/commit/e71e5d11aaa79973e28a1d3c4699f9a63744797b))


### BREAKING CHANGES

* Replace @cocreate/socket-server with @cocreate/socket. Export SocketClient and SocketServer by name, default to SocketClient, and provide separate client and server entry points.

## [2.0.1](https://github.com/CoCreateJS/socket/compare/v2.0.0...v2.0.1) (2026-11-05)


### Bug Fixes

* report organization inactivity for scale-to-zero lifecycle ([37b0980](https://github.com/CoCreateJS/socket/commit/37b09803bfa97101d60c13d7a9afe9d4366c7a77))
* upgrade CoCreate dependencies to v2 ([f4001a6](https://github.com/CoCreateJS/socket/commit/f4001a623b49affe71f667a833f005916e55b17b))

# [2.0.0](https://github.com/CoCreateJS/socket/compare/v1.34.0...v2.0.0) (2026-11-02)


### chore

* record package identity migration as breaking ([fe05f08](https://github.com/CoCreateJS/socket/commit/fe05f087f48163acdb4cb90b6f0bb6e672ceb5bc))


### BREAKING CHANGES

* Consumers must install @cocreate/socket and use the renamed CoCreateJS repository identity; the previous package and repository identities are no longer supported.

# [1.34.0](https://github.com/CoCreateJS/socket/compare/v1.33.0...v1.34.0) (2026-11-02)


### Bug Fixes

* add clientInfo to socket options in SocketServer ([c3d7d52](https://github.com/CoCreateJS/socket/commit/c3d7d5221ecedf347c8730f2120035700b01dfdc))
* add Deno specific entries to .gitignore ([ce5b0eb](https://github.com/CoCreateJS/socket/commit/ce5b0eb01c67e4f70b38d4c7e41253c22a045f40))
* align subscription delivery defaults ([934df16](https://github.com/CoCreateJS/socket/commit/934df160b308e2e0a5dbd428ef44bd3ef71f521e))
* bump [@cocreate](https://github.com/cocreate) dependencies ([b01818a](https://github.com/CoCreateJS/socket/commit/b01818a01fd521c43cb6d86de28c9de32cdf7961))
* bump versions ([849012f](https://github.com/CoCreateJS/socket/commit/849012f04a3f8bd25cd9a41188bc071b5b019a82))
* bump versions ([03ce669](https://github.com/CoCreateJS/socket/commit/03ce6691abf272b92cbdbe3a9c95d75c1338ee65))
* bumped dependencies ([b9fa757](https://github.com/CoCreateJS/socket/commit/b9fa75731426c85009e1a3f450018841dda3f4da))
* data.api ([b8313ea](https://github.com/CoCreateJS/socket/commit/b8313ea9583870cc71cc6970c0ee99d40e2ee37f))
* deliver requester responses with callback-aware socket failover ([3b465d1](https://github.com/CoCreateJS/socket/commit/3b465d11a3de834172cfa4168ab0ecbfd77e5d40))
* emit api ([daa6f31](https://github.com/CoCreateJS/socket/commit/daa6f31319fb72c89fb8137470fd26ce553bf509))
* enhance organization eviction logic and update message payload structure ([e4f43d6](https://github.com/CoCreateJS/socket/commit/e4f43d6eabc21cd516e31eeb7b5bf8bf66791428))
* ensure method is required in message handling ([03818b6](https://github.com/CoCreateJS/socket/commit/03818b686882223b79806094151927ec94f156d6))
* remove trailing slash from node_modules entry in .gitignore ([9f6c69e](https://github.com/CoCreateJS/socket/commit/9f6c69ec49a1eacce2469c2bde54a426fd0e4807))
* replace legacy $filter field with filter ([55a909a](https://github.com/CoCreateJS/socket/commit/55a909a4c0fbeb33693d6247e25d711cf8cb315b))
* replace uuid import with utils and update serverId generation ([328becd](https://github.com/CoCreateJS/socket/commit/328becd461ed283592fd437fa74636b0695a00b4))
* route socket responses by socket id ([88878d9](https://github.com/CoCreateJS/socket/commit/88878d98200a46112b311fbdb531a367d372af7f))
* simplify WebSocketServer import from 'ws' ([5421a52](https://github.com/CoCreateJS/socket/commit/5421a52a43de155fea8e57f7861bb68349476081))
* update config method to use request for organization_id prompt ([240f23a](https://github.com/CoCreateJS/socket/commit/240f23a9e1b77933c4be689c8334ef95066ab2b8))
* update git url ([eae57d5](https://github.com/CoCreateJS/socket/commit/eae57d5eee052a0ac3816fe7bceb8617a8ff0b59))
* update GitHub Actions to use latest versions and sync package.json description ([5d600b6](https://github.com/CoCreateJS/socket/commit/5d600b67721c7eff08ea8563737b15d363a75dfd))
* update import for config and refactor logging logic ([1ea801b](https://github.com/CoCreateJS/socket/commit/1ea801b3aa74afa33ca734592b5999d9479dccdb))
* update ws dependency version to ^8.21.1 ([7d5312c](https://github.com/CoCreateJS/socket/commit/7d5312c64472a049e3a006ce680637a1e1d454e6))
* use WebSocket reference for socket state checks ([364d03d](https://github.com/CoCreateJS/socket/commit/364d03df1703e96ab7271b8d60926049bfba0c4a))


### Features

* bump all dependencies ([d946772](https://github.com/CoCreateJS/socket/commit/d946772b879b07520ed651725a7701a5c4c6640a))
* bumped all dependency versions ([5336034](https://github.com/CoCreateJS/socket/commit/53360347e2e133007ff287f8fa5576c86bc1d3ad))
* Replace acme with certificates ([6c33cde](https://github.com/CoCreateJS/socket/commit/6c33cdeb528c5485fa9a9d41cfbf53b7a2b289f1))
* route socket messages by subscription ([6b97e18](https://github.com/CoCreateJS/socket/commit/6b97e187a760b5558d52b00f9d861035236ed0c9))
* unify socket routing and organization registration ([d7a0443](https://github.com/CoCreateJS/socket/commit/d7a0443e9ad3e96f032e2ddc11bb4f60975e437c))

# [1.33.0](https://github.com/CoCreateJS/socket/compare/v1.32.0...v1.33.0) (2026-07-19)


### Bug Fixes

* update branch references from master to main in workflow and configuration files ([2148193](https://github.com/CoCreateJS/socket/commit/2148193e0471a193abf8443e6adef3b8b75a4d70))


### Features

* add process-level events for organization eviction and cleanup in SocketServer ([fcbe3a2](https://github.com/CoCreateJS/socket/commit/fcbe3a24eb87af3bc9d112cfff31f7e7df2c9af2))
* enhance SocketServer with server reference caching and improved organization management ([2b8daaf](https://github.com/CoCreateJS/socket/commit/2b8daafe0a43497be5144f03af562e11b12a2970))
* rename bandwidth events to usage for clarity in socket message handling ([8f2f549](https://github.com/CoCreateJS/socket/commit/8f2f549c031224a29d7d2daf11636cf8688c75dc))
* update automated workflow and release configuration for improved semantic release handling ([5b8659f](https://github.com/CoCreateJS/socket/commit/5b8659ff2430ad0029bea4b740832917429bb548))

# [1.32.0](https://github.com/CoCreateJS/socket/compare/v1.31.1...v1.32.0) (2026-07-14)


### Bug Fixes

* remove unused mesh.js file and related socket handling logic ([b0cab03](https://github.com/CoCreateJS/socket/commit/b0cab03c4c106c109c0d9c13157ae118f6189ef5))
* removed post install ([c1462c3](https://github.com/CoCreateJS/socket/commit/c1462c3874bac9b24444d69334a8a80ee74d4b4f))
* semantic version handling. Reorganize .gitignore for improved clarity and structure ([3a04ef8](https://github.com/CoCreateJS/socket/commit/3a04ef83a5db2aadd96cee6374c8c19129d3aaf2))
* update module export to ES6 syntax in release.config.js ([958adb2](https://github.com/CoCreateJS/socket/commit/958adb2fc45e6828f494def07e57c654f8bd105e))
* update package.json and refactor for module compatibility ([618fae4](https://github.com/CoCreateJS/socket/commit/618fae440238f9196415c2702e2b13a9d231fb15))
* update WebSocket import for compatibility across module systems ([a8e270a](https://github.com/CoCreateJS/socket/commit/a8e270aaeb71b93d7b0a777dcb7ebafa5008bfa5))


### Features

* implement heartbeat mechanism for socket connections and enhance organization/client management ([568fb3e](https://github.com/CoCreateJS/socket/commit/568fb3efc27da677fb298b3035fe7638d7435440))
* streamline SocketServer initialization and enhance error handling ([3d102e1](https://github.com/CoCreateJS/socket/commit/3d102e18718cb3cda41471a12a437d4d9abad402))

## [1.31.1](https://github.com/CoCreateJS/socket/compare/v1.31.0...v1.31.1) (2025-05-01)


### Bug Fixes

* update [@cocreate](https://github.com/cocreate) dependencies ([ffe15a3](https://github.com/CoCreateJS/socket/commit/ffe15a3838ef5eaddbfec366be07bf410a539c49))

# [1.31.0](https://github.com/CoCreateJS/socket/compare/v1.30.0...v1.31.0) (2025-04-30)


### Features

* if data.endpoint emit "endpoint" ([93c650d](https://github.com/CoCreateJS/socket/commit/93c650d90556771676a87ff4c4a9e7d493c72c25))

# [1.30.0](https://github.com/CoCreateJS/socket/compare/v1.29.5...v1.30.0) (2024-11-04)


### Bug Fixes

* prettier.config options ([f9fedfa](https://github.com/CoCreateJS/socket/commit/f9fedfa2f668d73b548db3ecfcb0abc623610a7d))


### Features

* add prettier.config.js and format files ([e24bf77](https://github.com/CoCreateJS/socket/commit/e24bf77ef7bb06bb99b2c0f31157cdd46cf8cbad))

## [1.29.5](https://github.com/CoCreateJS/socket/compare/v1.29.4...v1.29.5) (2024-07-03)


### Bug Fixes

* handling of message_log ([121ab98](https://github.com/CoCreateJS/socket/commit/121ab98afdd8e8c700730d44e101c530bc47fdcd))

## [1.29.4](https://github.com/CoCreateJS/socket/compare/v1.29.3...v1.29.4) (2024-06-23)


### Bug Fixes

* bump dependencies ([3a4d958](https://github.com/CoCreateJS/socket/commit/3a4d9580af9d70706372aa937b7f24e9f1e9553e))

## [1.29.3](https://github.com/CoCreateJS/socket/compare/v1.29.2...v1.29.3) (2024-06-23)


### Bug Fixes

* update dependencies ([94a0d53](https://github.com/CoCreateJS/socket/commit/94a0d530e19f9e58516ff09f2f630a7e1c4c8288))

## [1.29.2](https://github.com/CoCreateJS/socket/compare/v1.29.1...v1.29.2) (2024-06-22)


### Bug Fixes

* temporarily handle sending messages that dont have modules ([f1f6407](https://github.com/CoCreateJS/socket/commit/f1f6407817b95040accebd9fc4523a1817928ff2))

## [1.29.1](https://github.com/CoCreateJS/socket/compare/v1.29.0...v1.29.1) (2024-04-26)


### Bug Fixes

* clearTimout if userid seesion is reconnected ([4895fff](https://github.com/CoCreateJS/socket/commit/4895fff37e85eb2cdd3bb985804e8c362268360e))

# [1.29.0](https://github.com/CoCreateJS/socket/compare/v1.28.3...v1.29.0) (2024-03-18)


### Features

* get socket using socket.id to maintain a persitient socket connection wtih client tabs ([922a462](https://github.com/CoCreateJS/socket/commit/922a4629573751ca87e72fde46598bc340af419f))

## [1.28.3](https://github.com/CoCreateJS/socket/compare/v1.28.2...v1.28.3) (2024-02-18)


### Bug Fixes

* add host ([7542ee7](https://github.com/CoCreateJS/socket/commit/7542ee7cb28821515078a912e40574aa0c761b00))

## [1.28.2](https://github.com/CoCreateJS/socket/compare/v1.28.1...v1.28.2) (2024-02-15)


### Bug Fixes

* data.socket removal before sending ([ed9b6a1](https://github.com/CoCreateJS/socket/commit/ed9b6a19e8da58a48f5eabd44b2419cc13f3c433))

## [1.28.1](https://github.com/CoCreateJS/socket/compare/v1.28.0...v1.28.1) (2024-02-05)


### Bug Fixes

* Removed https://cdn.CoCreateJS.com/latest/CoCreate.min.css ([f16de7e](https://github.com/CoCreateJS/socket/commit/f16de7e2b2f5d985b754eb19a36426ea5e49632e))

# [1.28.0](https://github.com/CoCreateJS/socket/compare/v1.27.1...v1.28.0) (2024-01-30)


### Features

* seperate onMessage from Message in order to to support internal message ([231f2cc](https://github.com/CoCreateJS/socket/commit/231f2cc796a4ddc35aa93960e3e0cae87527853e))

## [1.27.1](https://github.com/CoCreateJS/socket/compare/v1.27.0...v1.27.1) (2024-01-17)


### Bug Fixes

* handling of host and origin. Updated to support new query system ([61a1c68](https://github.com/CoCreateJS/socket/commit/61a1c685a1d3466836b19867558842632c7994a4))

# [1.27.0](https://github.com/CoCreateJS/socket/compare/v1.26.0...v1.27.0) (2024-01-08)


### Bug Fixes

* applied host to define environment/branch ([fad44e5](https://github.com/CoCreateJS/socket/commit/fad44e52babae6dd142c22e88214956e2d3dfd97))


### Features

* bumped CoCreate dependencies to their latest versions ([b043307](https://github.com/CoCreateJS/socket/commit/b043307cb515a75a6fafd261ddb6295ceaba0ba9))

# [1.26.0](https://github.com/CoCreateJS/socket/compare/v1.25.0...v1.26.0) (2024-01-03)


### Bug Fixes

* comment checkCertificate ([f70e8de](https://github.com/CoCreateJS/socket/commit/f70e8def302498d1f93cc4badde012333bbe8ea0))


### Features

* Added '[@cocreate-server](https://github.com/cocreate-server)' handle http and https ([5f530b1](https://github.com/CoCreateJS/socket/commit/5f530b135cb25a3af51fe059af57a235d0c3d51c))

# [1.25.0](https://github.com/CoCreateJS/socket/compare/v1.24.3...v1.25.0) (2023-12-31)


### Features

* Added '@cocreate/certificates' for dynamic ssl management ([f01831b](https://github.com/CoCreateJS/socket/commit/f01831bf2d3a8a4812c369fb61927667af56f7d5))

## [1.24.3](https://github.com/CoCreateJS/socket/compare/v1.24.2...v1.24.3) (2023-12-18)


### Bug Fixes

* if no sockets[i] continue ([fcab2cc](https://github.com/CoCreateJS/socket/commit/fcab2ccbf5ea6199ac2e2ceb111aa1fa6f23cf28))

## [1.24.2](https://github.com/CoCreateJS/socket/compare/v1.24.1...v1.24.2) (2023-12-09)


### Bug Fixes

* emit first part of method which is module name ([d5d2f2d](https://github.com/CoCreateJS/socket/commit/d5d2f2d70f1effece7e77c95cb409b82609ee228))

## [1.24.1](https://github.com/CoCreateJS/socket/compare/v1.24.0...v1.24.1) (2023-12-05)


### Bug Fixes

* async await upgrade to handle authenticate ([e6416f5](https://github.com/CoCreateJS/socket/commit/e6416f5725ece424b69a142b70de4a0ca6687869))

# [1.24.0](https://github.com/CoCreateJS/socket/compare/v1.23.0...v1.24.0) (2023-11-25)


### Bug Fixes

* update licensing details ([e105a05](https://github.com/CoCreateJS/socket/commit/e105a05f3d5c9a0f889a99f4cf8f086c46c93679))


### Features

* upgrade dependencies for latest features and fixes ([33f5073](https://github.com/CoCreateJS/socket/commit/33f50737ff478d1147ea183e2fa058d5dc8dca35))

# [1.23.0](https://github.com/CoCreateJS/socket/compare/v1.22.0...v1.23.0) (2023-11-25)


### Bug Fixes

* userStatus across various clientid ([507d5e5](https://github.com/CoCreateJS/socket/commit/507d5e5b7e17a6aadb6b1b4522b8f753d0156715))


### Features

* upgrade dependencies for latest features and fixes ([5176e69](https://github.com/CoCreateJS/socket/commit/5176e69558a57af55d003608fb24515103877edd))

# [1.22.0](https://github.com/CoCreateJS/socket/compare/v1.21.11...v1.22.0) (2023-11-19)


### Features

* update dependecies for th latest features and bug fixes ([6da29d2](https://github.com/CoCreateJS/socket/commit/6da29d232c85a774af066838141a8b399ae21ba1))

## [1.21.11](https://github.com/CoCreateJS/socket/compare/v1.21.10...v1.21.11) (2023-11-16)


### Bug Fixes

* bump dependencies for latest features ([fb30338](https://github.com/CoCreateJS/socket/commit/fb30338b5f1282430ff07eefb8ef1c0bacde9964))

## [1.21.10](https://github.com/CoCreateJS/socket/compare/v1.21.9...v1.21.10) (2023-11-12)


### Bug Fixes

* bump dependencies for latest features ([1289fea](https://github.com/CoCreateJS/socket/commit/1289fead1840da1d092cb52d4b4bd71bb47c3d2b))

## [1.21.9](https://github.com/CoCreateJS/socket/compare/v1.21.8...v1.21.9) (2023-11-11)


### Bug Fixes

* sync console.log ([b49bb6a](https://github.com/CoCreateJS/socket/commit/b49bb6a2ccf8cf3f166b9f7acd511a28109202eb))

## [1.21.8](https://github.com/CoCreateJS/socket/compare/v1.21.7...v1.21.8) (2023-11-09)


### Bug Fixes

* url bug ([5265962](https://github.com/CoCreateJS/socket/commit/526596254d9554de67dc78b296abe57765cb51fc))

## [1.21.7](https://github.com/CoCreateJS/socket/compare/v1.21.6...v1.21.7) (2023-11-09)


### Bug Fixes

* meta name typo ([37b85be](https://github.com/CoCreateJS/socket/commit/37b85bee20c4ff7e73eccca039f9dbeb84c82417))
* update crud methods ([2853e1f](https://github.com/CoCreateJS/socket/commit/2853e1f82c76998cdf2d5de3ee05128c454bd2e8))
* update host ([4139426](https://github.com/CoCreateJS/socket/commit/41394268a2b0814d2373870184c7d30c60b94383))
* updated date to ISO format with UTC timezone ([98b5e0a](https://github.com/CoCreateJS/socket/commit/98b5e0abd9768e8297b54db9a4b86babf3fc69ca))

## [1.21.6](https://github.com/CoCreateJS/socket/compare/v1.21.5...v1.21.6) (2023-11-03)


### Bug Fixes

*  authorized false condition ([056e59a](https://github.com/CoCreateJS/socket/commit/056e59a41558f3a4a4450aa84ef8043ee1e5922b))
* $addToSet.activeHost ([d705f16](https://github.com/CoCreateJS/socket/commit/d705f16ab7bef6bf6c0fe2f5f4d9416b1d9df463))
* update dependencies to the lates versions ([6260248](https://github.com/CoCreateJS/socket/commit/62602485421b432ad00ca25712b3798c3a97eeef))
* update method to use object.update etc ([10e4530](https://github.com/CoCreateJS/socket/commit/10e4530ea792e7e71bdf79a1c965e94bf2204edf))

## [1.21.5](https://github.com/CoCreateJS/socket/compare/v1.21.4...v1.21.5) (2023-10-26)


### Bug Fixes

* disabled message_log ([0977880](https://github.com/CoCreateJS/socket/commit/09778807aeaf9b7d574d956e0327d3277554ea19))

## [1.21.4](https://github.com/CoCreateJS/socket/compare/v1.21.3...v1.21.4) (2023-10-25)


### Bug Fixes

* socket push conditions ([887fef3](https://github.com/CoCreateJS/socket/commit/887fef3d86d35eb9a0832dd1d0cd998652a494dc))

## [1.21.3](https://github.com/CoCreateJS/socket/compare/v1.21.2...v1.21.3) (2023-10-25)


### Bug Fixes

* bump dependencies ([43243af](https://github.com/CoCreateJS/socket/commit/43243af35bb1ec196b9ca76b9673024b06a5dca8))

## [1.21.2](https://github.com/CoCreateJS/socket/compare/v1.21.1...v1.21.2) (2023-10-24)


### Bug Fixes

* if no organization conditions ([8847125](https://github.com/CoCreateJS/socket/commit/8847125f80dcc761692fa2cdcb87f446a0ee7623))

## [1.21.1](https://github.com/CoCreateJS/socket/compare/v1.21.0...v1.21.1) (2023-10-24)


### Bug Fixes

* allow organization to connect if serverOrganization false ([b91a1b5](https://github.com/CoCreateJS/socket/commit/b91a1b574ecb14604245930bd8ebf563f9e9f445))
* return access denied ([bb9a929](https://github.com/CoCreateJS/socket/commit/bb9a929481fc34fc2ead377577100cf6908c4707))

# [1.21.0](https://github.com/CoCreateJS/socket/compare/v1.20.2...v1.21.0) (2023-10-22)


### Features

* ObjectId() returns an object containg the parts iof the _id along with a toString() function ([d0fffc7](https://github.com/CoCreateJS/socket/commit/d0fffc777f099b242a0dccfe5ed6b8008d54dda2))

## [1.20.2](https://github.com/CoCreateJS/socket/compare/v1.20.1...v1.20.2) (2023-10-21)


### Bug Fixes

* added more methods to the message_log if condition ([37f1106](https://github.com/CoCreateJS/socket/commit/37f1106efc30c1278aded8462d779c70e18f28f4))

## [1.20.1](https://github.com/CoCreateJS/socket/compare/v1.20.0...v1.20.1) (2023-10-19)


### Bug Fixes

* do not log updateUserStatus ([f98961b](https://github.com/CoCreateJS/socket/commit/f98961b91106ea34b3afeefdafbfcc1dffca095e))

# [1.20.0](https://github.com/CoCreateJS/socket/compare/v1.19.5...v1.20.0) (2023-10-19)


### Bug Fixes

* delete data.socket ([4fd38ff](https://github.com/CoCreateJS/socket/commit/4fd38ffd9989502955eb73d7d21f90102ea41e69))
* improved error handling ([04be91f](https://github.com/CoCreateJS/socket/commit/04be91ffcc62c7270fc83cbb1c755125485496fb))


### Features

* delay user deletion for potential reconnect ([34e3a14](https://github.com/CoCreateJS/socket/commit/34e3a143776a0e67f8cea56ab2f0334a1e349df2))
* If authinticated emit 'notification.user' ([ac4779f](https://github.com/CoCreateJS/socket/commit/ac4779f0773e5f9b906390648c536e654cc1f40a))

## [1.19.5](https://github.com/CoCreateJS/socket/compare/v1.19.4...v1.19.5) (2023-10-16)


### Bug Fixes

* improved error handling ([a3e5d31](https://github.com/CoCreateJS/socket/commit/a3e5d314143f135816de7b51696626c53e6a88f0))

## [1.19.4](https://github.com/CoCreateJS/socket/compare/v1.19.3...v1.19.4) (2023-10-14)


### Bug Fixes

* bump dependencies ([01451f6](https://github.com/CoCreateJS/socket/commit/01451f65ba929621a6ad0ea54194263b292ebcd2))

## [1.19.3](https://github.com/CoCreateJS/socket/compare/v1.19.2...v1.19.3) (2023-10-09)


### Bug Fixes

* bump dependencies ([71f4216](https://github.com/CoCreateJS/socket/commit/71f4216acd9e56656291f9a5b5b89a004c520bc9))

## [1.19.2](https://github.com/CoCreateJS/socket/compare/v1.19.1...v1.19.2) (2023-10-09)


### Bug Fixes

* comment utils ([487ee16](https://github.com/CoCreateJS/socket/commit/487ee1640ed8fa641cca1eaeef03d6df30a48923))

## [1.19.1](https://github.com/CoCreateJS/socket/compare/v1.19.0...v1.19.1) (2023-10-09)


### Bug Fixes

* authentication ([ccc5e1d](https://github.com/CoCreateJS/socket/commit/ccc5e1d4aa50e3dc2ea627200c634a0ca7c83721))
* bump cocreate dependency versions ([6c74306](https://github.com/CoCreateJS/socket/commit/6c7430664987fdfe955fe705c413a7313e5dca51))
* this to self ([24119fb](https://github.com/CoCreateJS/socket/commit/24119fb5583ad34fd2210befad92fba1743ce804))

# [1.19.0](https://github.com/CoCreateJS/socket/compare/v1.18.1...v1.19.0) (2023-10-09)


### Bug Fixes

* added '@cocreate/utlis' ([cc8267a](https://github.com/CoCreateJS/socket/commit/cc8267abf7ded45033929bd4c4997eb9adc89d42))
* handling of socket.id and clientId ([9e66f16](https://github.com/CoCreateJS/socket/commit/9e66f16f4e869e7ec29a261068fb61c46569f408))
* Improved handling of data.sync ([190ebd6](https://github.com/CoCreateJS/socket/commit/190ebd6c10f337fbd4e8be81caba865cfffb5c0a))
* send _id with syncMessage ([e37e2de](https://github.com/CoCreateJS/socket/commit/e37e2de8aff8945a3884c416514adc1e89fc54e2))
* update to use data.socketId and data.clientId ([125f2be](https://github.com/CoCreateJS/socket/commit/125f2bedd6090488ae26dc2228b53bb4aa63d4ff))
* use message_log ([d4b4c4a](https://github.com/CoCreateJS/socket/commit/d4b4c4ad2708cd61567d7172ac7bcb0635349a6a))


### Features

* Authentication happens during upgrade ([c01cb0e](https://github.com/CoCreateJS/socket/commit/c01cb0eeb5fc4e135a8d9855fbab7e8b9535423d))
* get, set, delete socket functions ([9066911](https://github.com/CoCreateJS/socket/commit/9066911016072841cd08463c8354eeef892b41e3))
* method sync sent to server with sync details ([3c914b7](https://github.com/CoCreateJS/socket/commit/3c914b74d720949c8ae56f3f9159041ef1d5f24f))
* on socket connection the data is parsed from ([0b69b35](https://github.com/CoCreateJS/socket/commit/0b69b357c891da63c3e94aaca8361866f252de98))

## [1.18.1](https://github.com/CoCreateJS/socket/compare/v1.18.0...v1.18.1) (2023-09-18)


### Bug Fixes

*  Add path and pathname ([5b5fb7e](https://github.com/CoCreateJS/socket/commit/5b5fb7e6d718f916dfdbfc3754cb63c6b1a51c47))
* Update clients array to use map for improved management of each client ([cff2f2a](https://github.com/CoCreateJS/socket/commit/cff2f2ad3d34ac1d7b926180da508c65e5855b37))
* Update dCoCreate dpendencies to latest versions ([03fa429](https://github.com/CoCreateJS/socket/commit/03fa429efc31db9f0ed5aec41dbf5b471475e0ba))

# [1.18.0](https://github.com/CoCreateJS/socket/compare/v1.17.0...v1.18.0) (2023-09-17)


### Bug Fixes

* send to client ([efa3954](https://github.com/CoCreateJS/socket/commit/efa395477b728b0593c4426cb4d536de7ea76c4a))


### Features

* socket referenced in the data object. ([1f19f38](https://github.com/CoCreateJS/socket/commit/1f19f38c14b8bfee6556d8bd52ac53aa9d3bf07b))
* socket referenced in the data object. ([1dbad0d](https://github.com/CoCreateJS/socket/commit/1dbad0db9b4ff60c834beb7552f369f94e18368b))

# [1.17.0](https://github.com/CoCreateJS/socket/compare/v1.16.3...v1.17.0) (2023-09-07)


### Features

* organzations map to store the orgs active status, if the org balance falls bellow 0 false is set resulting in socket and file-server responding with 0 balance  error message ([e06b8b1](https://github.com/CoCreateJS/socket/commit/e06b8b173fc24b98b60a9bd24494bb1fceea19cc))

## [1.16.3](https://github.com/CoCreateJS/socket/compare/v1.16.2...v1.16.3) (2023-08-21)


### Bug Fixes

* update permission functions and variable to authorize for improved clarity and readability ([19c7415](https://github.com/CoCreateJS/socket/commit/19c74155e696886f3daab672489febf6009c2e1a))

## [1.16.2](https://github.com/CoCreateJS/socket/compare/v1.16.1...v1.16.2) (2023-08-21)


### Bug Fixes

* removed build as no webpack.config exist ([1acd03e](https://github.com/CoCreateJS/socket/commit/1acd03e81b43363d1f132e1c98cec814ee31a527))

## [1.16.1](https://github.com/CoCreateJS/socket/compare/v1.16.0...v1.16.1) (2023-08-21)


### Bug Fixes

* bump dependencies ([afb7a51](https://github.com/CoCreateJS/socket/commit/afb7a510686dbf052c1dbecff15e86088e802001))

# [1.16.0](https://github.com/CoCreateJS/socket/compare/v1.15.1...v1.16.0) (2023-08-21)


### Features

* Update cocreate dependencies for the latest features and bug fixes ([fe6d281](https://github.com/CoCreateJS/socket/commit/fe6d2812ed9b708e1365be18e9bdbf83dbb38d3e))

## [1.15.1](https://github.com/CoCreateJS/socket/compare/v1.15.0...v1.15.1) (2023-08-21)


### Bug Fixes

* /dist/CoCreate.js updated to https://CoCreateJS.com/dist/CoCreate.js ([2f991c6](https://github.com/CoCreateJS/socket/commit/2f991c61acf8ee5fad4f339603bed9cfe3289deb))
* replace cdn with /dist ([832ec88](https://github.com/CoCreateJS/socket/commit/832ec881cbf7b05d909b7ac4ce7eeb6f7fb95e20))
* update file uploader ([84f1c51](https://github.com/CoCreateJS/socket/commit/84f1c51dd32c88619579a86d30ef149408f471e9))
* update variable name for better readability ([5415c05](https://github.com/CoCreateJS/socket/commit/5415c0559000f116a66bc534a89ca3073e8df1b3))

# [1.15.0](https://github.com/CoCreateJS/socket/compare/v1.14.0...v1.15.0) (2023-08-17)


### Features

* bump cocreate dependencies for the latest updates and features ([553d00e](https://github.com/CoCreateJS/socket/commit/553d00e8991c0e81c40ca635d9c763e3d4324fff))

# [1.14.0](https://github.com/CoCreateJS/socket/compare/v1.13.19...v1.14.0) (2023-08-16)


### Bug Fixes

* crud attributes renamed ([e17e290](https://github.com/CoCreateJS/socket/commit/e17e290df4500495f070a93e69ffaafe4f1639f8))
* Refactored *-target to *-selector ([6716c50](https://github.com/CoCreateJS/socket/commit/6716c5011ff3b78445bac13c7337bd49f35cc71c))


### Features

* name attribute and variable renamed to key ([ac1e91e](https://github.com/CoCreateJS/socket/commit/ac1e91e595b8a52c869bb34e629843cff22fa979))

## [1.13.19](https://github.com/CoCreateJS/socket/compare/v1.13.18...v1.13.19) (2023-06-16)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([c913911](https://github.com/CoCreateJS/socket/commit/c91391110e8da1a543d3317e9aa6cf5ad20d1e44))

## [1.13.18](https://github.com/CoCreateJS/socket/compare/v1.13.17...v1.13.18) (2023-06-15)


### Bug Fixes

* Updatae [@cocreate](https://github.com/cocreate) dependnenies to the latest versions ([f677b67](https://github.com/CoCreateJS/socket/commit/f677b677676d2a3b0b1c786ed6ba65c78b5f99ac))

## [1.13.17](https://github.com/CoCreateJS/socket/compare/v1.13.16...v1.13.17) (2023-06-15)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([80a853c](https://github.com/CoCreateJS/socket/commit/80a853c6fc01790975ca24c35f1adb5f8d242c25))

## [1.13.16](https://github.com/CoCreateJS/socket/compare/v1.13.15...v1.13.16) (2023-06-15)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([76dbe51](https://github.com/CoCreateJS/socket/commit/76dbe51c6a3efa5816e05712d5a447275d419ca9))

## [1.13.15](https://github.com/CoCreateJS/socket/compare/v1.13.14...v1.13.15) (2023-06-14)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([918ac60](https://github.com/CoCreateJS/socket/commit/918ac604711c330c9b90a5cacb5b6453e9dc2bf2))

## [1.13.14](https://github.com/CoCreateJS/socket/compare/v1.13.13...v1.13.14) (2023-06-14)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([2259499](https://github.com/CoCreateJS/socket/commit/2259499bf333055e578aec68fd3aed68fba8ab1c))

## [1.13.13](https://github.com/CoCreateJS/socket/compare/v1.13.12...v1.13.13) (2023-06-13)


### Bug Fixes

* config usages ([21dd9ab](https://github.com/CoCreateJS/socket/commit/21dd9abb3fc53e484b67c83249916fa33af74762))

## [1.13.12](https://github.com/CoCreateJS/socket/compare/v1.13.11...v1.13.12) (2023-06-11)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([ad1834e](https://github.com/CoCreateJS/socket/commit/ad1834ee5792f13925dcacc66b94829e6cf4feb2))

## [1.13.11](https://github.com/CoCreateJS/socket/compare/v1.13.10...v1.13.11) (2023-06-11)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([879c6e9](https://github.com/CoCreateJS/socket/commit/879c6e90d07e8b3f69c2504cd97f8683f7767850))

## [1.13.10](https://github.com/CoCreateJS/socket/compare/v1.13.9...v1.13.10) (2023-06-11)


### Bug Fixes

* testing workflow ([5b7002b](https://github.com/CoCreateJS/socket/commit/5b7002b1dd54da320ab162aff8e92170e286bdae))

## [1.13.9](https://github.com/CoCreateJS/socket/compare/v1.13.8...v1.13.9) (2023-06-11)


### Bug Fixes

* testing workflow ([3dd5fb9](https://github.com/CoCreateJS/socket/commit/3dd5fb98bdc6e1bb73098364f1f84e1008b3f58d))

## [1.13.8](https://github.com/CoCreateJS/socket/compare/v1.13.7...v1.13.8) (2023-06-11)


### Bug Fixes

* testing workflow ([96b2f9b](https://github.com/CoCreateJS/socket/commit/96b2f9bd7b26a0b7a44f4fea5b56eede222448d3))
* testing workflow ([387967c](https://github.com/CoCreateJS/socket/commit/387967c50750794e7b14597ad74f564ce0d79402))

## [1.13.7](https://github.com/CoCreateJS/socket/compare/v1.13.6...v1.13.7) (2023-06-11)


### Bug Fixes

* testing workflow ([c1b8576](https://github.com/CoCreateJS/socket/commit/c1b8576f0066ba84a1c48fabbddd03ce4139f959))

## [1.13.6](https://github.com/CoCreateJS/socket/compare/v1.13.5...v1.13.6) (2023-06-11)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([d44de0c](https://github.com/CoCreateJS/socket/commit/d44de0c93c013676b6abb58613a7407f737e8e17))

## [1.13.5](https://github.com/CoCreateJS/socket/compare/v1.13.4...v1.13.5) (2023-06-11)


### Bug Fixes

* postintall error ([4ef6e9e](https://github.com/CoCreateJS/socket/commit/4ef6e9e1734129ecd66b0e3bbf1b4387dec64b23))

## [1.13.4](https://github.com/CoCreateJS/socket/compare/v1.13.3...v1.13.4) (2023-06-11)


### Bug Fixes

* @cocreate/cli moved to dependencies ([0b6f51d](https://github.com/CoCreateJS/socket/commit/0b6f51d2b9e58bd96bcee3663de7779a25472f23))

## [1.13.3](https://github.com/CoCreateJS/socket/compare/v1.13.2...v1.13.3) (2023-06-11)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([a62ae11](https://github.com/CoCreateJS/socket/commit/a62ae119398771c088e82b7c20911c5ebaa9d12e))

## [1.13.2](https://github.com/CoCreateJS/socket/compare/v1.13.1...v1.13.2) (2023-06-11)


### Bug Fixes

* renamed db to storage ([4766428](https://github.com/CoCreateJS/socket/commit/4766428c38e542282c301c457420dd3405a78206))
* renamed hosts to host. the value can be a string or an array of strings ([3c60a40](https://github.com/CoCreateJS/socket/commit/3c60a40d48dfd9b3343dfa738bb290cc47fb4766))

## [1.13.1](https://github.com/CoCreateJS/socket/compare/v1.13.0...v1.13.1) (2023-06-10)


### Bug Fixes

* Refactor authentication method to use token decoding 🚀 ([249cf69](https://github.com/CoCreateJS/socket/commit/249cf69c3ce918a2d5bee324456008e1923d8226))
* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([b7d21f3](https://github.com/CoCreateJS/socket/commit/b7d21f334dd160fbad19b4f3539b6adfbfed9861))

# [1.13.0](https://github.com/CoCreateJS/socket/compare/v1.12.1...v1.13.0) (2023-06-10)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([c5ea592](https://github.com/CoCreateJS/socket/commit/c5ea592a82ee5ed079bb51e876e52eadfda8df31))


### Features

* Add CLI prompts for "organization_id" and "db" string ([5e2b5ba](https://github.com/CoCreateJS/socket/commit/5e2b5babee1a28d084bd60c417d7e3c2b7ecdad0))

## [1.12.1](https://github.com/CoCreateJS/socket/compare/v1.12.0...v1.12.1) (2023-06-08)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([13323e2](https://github.com/CoCreateJS/socket/commit/13323e2f09884bc3237d5d1738975be590a1e613))

# [1.12.0](https://github.com/CoCreateJS/socket/compare/v1.11.0...v1.12.0) (2023-06-08)


### Features

* Add CORS headers to WebSocket server. ([4701892](https://github.com/CoCreateJS/socket/commit/47018927d34ef4792ab1c95e0493f3ddefaad11e))

# [1.11.0](https://github.com/CoCreateJS/socket/compare/v1.10.4...v1.11.0) (2023-06-07)


### Bug Fixes

* Refactor CoCreate.config.js to remove hard-coded credentials ([4c1033a](https://github.com/CoCreateJS/socket/commit/4c1033ae66aa16993f3821ee7248394e8aecab1c))
* workflow ([9594513](https://github.com/CoCreateJS/socket/commit/95945133a54d71ee0eb17ffa27ac938795fecc69))


### Features

* Refactor WebSocket server constructor and handleUpgrade method ([0caa836](https://github.com/CoCreateJS/socket/commit/0caa83606fcb1482b9fd14c5677e32edfc54f4e0))

## [1.10.4](https://github.com/CoCreateJS/socket/compare/v1.10.3...v1.10.4) (2023-06-04)


### Bug Fixes

* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([bcfbd7e](https://github.com/CoCreateJS/socket/commit/bcfbd7ed3b97e7b5e50b4c5ee0e5a1ed457f979c))

## [1.10.3](https://github.com/CoCreateJS/socket/compare/v1.10.2...v1.10.3) (2023-06-04)


### Bug Fixes

* **semantic-release:** worklow error solved by running node version 14 ([cf66b25](https://github.com/CoCreateJS/socket/commit/cf66b252b19f9ff9f92ebd95fe28b999f65a6900))
* Update dependencies versions for [@cocreate](https://github.com/cocreate) libraries ([724730a](https://github.com/CoCreateJS/socket/commit/724730a37f1bd9dce417eb68b55567f37daa7761))
* workflow test ([92af769](https://github.com/CoCreateJS/socket/commit/92af769ebf51cd74605c87d5bdd36668ed7e9e71))

## [1.10.2](https://github.com/CoCreateJS/socket/compare/v1.10.1...v1.10.2) (2023-05-25)


### Bug Fixes

* Delete AsyncMessage.js as by design the results are async & refactor index.js Emitting; authorized data in send method ([b47e6fc](https://github.com/CoCreateJS/socket/commit/b47e6fc0386b4beb25eefba90e74f47e91f949f2))

## [1.10.1](https://github.com/CoCreateJS/socket/compare/v1.10.0...v1.10.1) (2023-05-25)


### Bug Fixes

* Update dependencies versions ([d3cad89](https://github.com/CoCreateJS/socket/commit/d3cad89ad28f8b90c89b9fd3f30acab59496a623))

# [1.10.0](https://github.com/CoCreateJS/socket/compare/v1.9.0...v1.10.0) (2023-05-25)


### Features

* Simplify WebSocketServer Class, Replace Permission and Auth Instance with Single functions. ([4ec6eb3](https://github.com/CoCreateJS/socket/commit/4ec6eb35e034a119c3f4e24a054a7708f04e8ac4))

# [1.9.0](https://github.com/CoCreateJS/socket/compare/v1.8.2...v1.9.0) (2023-05-24)


### Features

* Refactored SocketServer permission checking and added a new function getHost. ([c6a51d1](https://github.com/CoCreateJS/socket/commit/c6a51d143fda143aca3d059958bc668f9fac6d04))

## [1.8.2](https://github.com/CoCreateJS/socket/compare/v1.8.1...v1.8.2) (2023-05-21)


### Bug Fixes

* Refactor socket server to track and limit server bandwidth usage. ([0c4c0f4](https://github.com/CoCreateJS/socket/commit/0c4c0f438a27e75d659044bfdcc19f422df67347))

## [1.8.1](https://github.com/CoCreateJS/socket/compare/v1.8.0...v1.8.1) (2023-05-20)


### Bug Fixes

* Refactor socket server code to re check permissions using platformId when organization.dbUrl is false. ([e0cae7a](https://github.com/CoCreateJS/socket/commit/e0cae7a0a2eb9c740f36a3306fc038a9c68329ab))
* updated dependencies to their latest versions ([84d2f1d](https://github.com/CoCreateJS/socket/commit/84d2f1d0a67b021682f5b9b543ededb995830231))

# [1.8.0](https://github.com/CoCreateJS/socket/compare/v1.7.7...v1.8.0) (2023-05-19)


### Bug Fixes

* Refactor index.js to remove unused code and improve readability ([8b71373](https://github.com/CoCreateJS/socket/commit/8b71373fc453d247389b786530c491754f8104d5))
* SocketServer class methods and properties ([9dd6f1d](https://github.com/CoCreateJS/socket/commit/9dd6f1d25b7bbe6a107d9076db31b73ac8a464b3))


### Features

* handle dbUrl false session ([61f64d2](https://github.com/CoCreateJS/socket/commit/61f64d2d02327ef3bec2821e8f3f083cc449a753))

## [1.7.7](https://github.com/CoCreateJS/socket/compare/v1.7.6...v1.7.7) (2023-05-11)


### Bug Fixes

* Acesss Denied handeling of createOrg ([ca9152c](https://github.com/CoCreateJS/socket/commit/ca9152c3792e084fb12f5942772c40c757f30370))

## [1.7.6](https://github.com/CoCreateJS/socket/compare/v1.7.5...v1.7.6) (2023-05-10)


### Bug Fixes

* apikey renamed to key ([b64597a](https://github.com/CoCreateJS/socket/commit/b64597af40ef4c3eb20e7e5e7f902a330db3f9d5))
* createOrg ([e859b23](https://github.com/CoCreateJS/socket/commit/e859b23662e41344defc53e066e4f17570e6e064))

## [1.7.5](https://github.com/CoCreateJS/socket/compare/v1.7.4...v1.7.5) (2023-04-24)


### Bug Fixes

* node version 16 in build action ([946a52e](https://github.com/CoCreateJS/socket/commit/946a52e79afb0af741269f1820ba17d4a3d59b5b))

## [1.7.4](https://github.com/CoCreateJS/socket/compare/v1.7.3...v1.7.4) (2023-04-24)


### Bug Fixes

* pwa manifest ([2c92143](https://github.com/CoCreateJS/socket/commit/2c92143245ebdfd08e349d6fbe3ecdcfa71ce695))
* updateUserStatus response ([13c1735](https://github.com/CoCreateJS/socket/commit/13c1735ca461e129669c9187c75ec3a90443f152))

## [1.7.3](https://github.com/CoCreateJS/socket/compare/v1.7.2...v1.7.3) (2023-04-11)


### Bug Fixes

*  bump [@cocreate](https://github.com/cocreate) dependencies ([596d787](https://github.com/CoCreateJS/socket/commit/596d7878d7a3d2c9dbd136ac92c99621e616aaed))

## [1.7.2](https://github.com/CoCreateJS/socket/compare/v1.7.1...v1.7.2) (2023-04-11)


### Bug Fixes

* handeling permission error ([325a78a](https://github.com/CoCreateJS/socket/commit/325a78a6bb6114b199088dcb8850b3e486e4cea4))

## [1.7.1](https://github.com/CoCreateJS/socket/compare/v1.7.0...v1.7.1) (2023-04-11)


### Bug Fixes

* removed permission.dbs it is now handeled by crud-server ([7dfb781](https://github.com/CoCreateJS/socket/commit/7dfb7812cf4ec020d23a5b688134d33abb029d0f))
* renamed domans to hosts ([6e4c75c](https://github.com/CoCreateJS/socket/commit/6e4c75cd2fae0d79950c06b1b919e913fd8b16d9))

# [1.7.0](https://github.com/CoCreateJS/socket/compare/v1.6.11...v1.7.0) (2023-03-19)


### Features

* if permmision returns db urls store in socket instance to allow crud to connect to user defined databases ([8342334](https://github.com/CoCreateJS/socket/commit/83423348c070a8985305ebf087ac83d538a6bc80))
* updated permission to return db urls to connect to 1 or more custom databases ([291fa5f](https://github.com/CoCreateJS/socket/commit/291fa5f14c8ef3ab82686935ee232dff413ad51d))

## [1.6.11](https://github.com/CoCreateJS/socket/compare/v1.6.10...v1.6.11) (2023-02-01)


### Bug Fixes

* bump dependencies ([07ced0b](https://github.com/CoCreateJS/socket/commit/07ced0ba1fdbd1ed6b4f2b995ff7e5a8a302cb81))

## [1.6.10](https://github.com/CoCreateJS/socket/compare/v1.6.9...v1.6.10) (2023-01-31)


### Bug Fixes

* bump dependencies ([d1bbfeb](https://github.com/CoCreateJS/socket/commit/d1bbfeb02d22a79f9cb8391ded49b6ff3c0cc02f))

## [1.6.9](https://github.com/CoCreateJS/socket/compare/v1.6.8...v1.6.9) (2023-01-30)


### Bug Fixes

* bump dependencies ([87377cd](https://github.com/CoCreateJS/socket/commit/87377cdc0d7dbe4ea7791ae8d0a97a681e20be0d))

## [1.6.8](https://github.com/CoCreateJS/socket/compare/v1.6.7...v1.6.8) (2023-01-29)


### Bug Fixes

* bump dependencies ([93c5a63](https://github.com/CoCreateJS/socket/commit/93c5a639612a81aac82abed85da2e0249079804f))

## [1.6.7](https://github.com/CoCreateJS/socket/compare/v1.6.6...v1.6.7) (2023-01-29)


### Bug Fixes

* bump dependencies ([c2bb5db](https://github.com/CoCreateJS/socket/commit/c2bb5dbbfd91330d61b47aa719e26ddde32564fe))

## [1.6.6](https://github.com/CoCreateJS/socket/compare/v1.6.5...v1.6.6) (2023-01-28)


### Bug Fixes

* bump dependencies ([ab247a0](https://github.com/CoCreateJS/socket/commit/ab247a0588d72a18723ac3f877f249f186bf1d7d))

## [1.6.5](https://github.com/CoCreateJS/socket/compare/v1.6.4...v1.6.5) (2023-01-13)


### Bug Fixes

* bump dependencies ([4e72067](https://github.com/CoCreateJS/socket/commit/4e7206758bb55d0d4212439d41fd84b417a13e17))

## [1.6.4](https://github.com/CoCreateJS/socket/compare/v1.6.3...v1.6.4) (2023-01-10)


### Bug Fixes

* bump dependencies ([7c4839a](https://github.com/CoCreateJS/socket/commit/7c4839ab36394ddc3a571454001067fb8dba0495))

## [1.6.3](https://github.com/CoCreateJS/socket/compare/v1.6.2...v1.6.3) (2023-01-09)


### Bug Fixes

* bump dependnecies ([71f18dd](https://github.com/CoCreateJS/socket/commit/71f18dd0ce5df50395a87698021b2153e2712cb1))

## [1.6.2](https://github.com/CoCreateJS/socket/compare/v1.6.1...v1.6.2) (2023-01-06)


### Bug Fixes

* bump dependencies, worklow [@v3](https://github.com/v3) ([e20678f](https://github.com/CoCreateJS/socket/commit/e20678fb1496a8b59e7f535cbe2ae20221c988d9))

## [1.6.1](https://github.com/CoCreateJS/socket/compare/v1.6.0...v1.6.1) (2023-01-05)


### Bug Fixes

* bump dependencies ([f0a5fbf](https://github.com/CoCreateJS/socket/commit/f0a5fbfcb42ce363ac93ac089ea0ab561676325d))

# [1.6.0](https://github.com/CoCreateJS/socket/compare/v1.5.3...v1.6.0) (2023-01-02)


### Features

* Access Denied returns action, status, and data ([cd98a28](https://github.com/CoCreateJS/socket/commit/cd98a287af38567d9a726964e63476d6cd15a90e))

## [1.5.3](https://github.com/CoCreateJS/socket/compare/v1.5.2...v1.5.3) (2023-01-01)


### Bug Fixes

* docs sanbox overflow ([19e4205](https://github.com/CoCreateJS/socket/commit/19e42053e27c4f8107b8f312c5bac807cb76ce60))

## [1.5.2](https://github.com/CoCreateJS/socket/compare/v1.5.1...v1.5.2) (2022-12-31)


### Bug Fixes

* bump dependencies ([1ce3c2e](https://github.com/CoCreateJS/socket/commit/1ce3c2ec04c164c20652349365cdb949b11f9d0b))

## [1.5.1](https://github.com/CoCreateJS/socket/compare/v1.5.0...v1.5.1) (2022-12-30)


### Bug Fixes

* update config sources to use template  braces with entry on src ([d8fe4cb](https://github.com/CoCreateJS/socket/commit/d8fe4cb46c28b64b13eebd517675ee9f9a0ff0b4))

# [1.5.0](https://github.com/CoCreateJS/socket/compare/v1.4.38...v1.5.0) (2022-12-29)


### Bug Fixes

* bump dependencies ([290b588](https://github.com/CoCreateJS/socket/commit/290b588c07e1064eaf55d839b285c4994abcdbe6))


### Features

* send userStatus off if auth fails ([bfc0252](https://github.com/CoCreateJS/socket/commit/bfc0252aacce3ce2b6ee0c138e4d6e3b723e15a3))

## [1.4.38](https://github.com/CoCreateJS/socket/compare/v1.4.37...v1.4.38) (2022-12-27)


### Bug Fixes

* bump dependencies ([7f2325e](https://github.com/CoCreateJS/socket/commit/7f2325e4fb9f33947e60afbf426e703582f518cd))

## [1.4.37](https://github.com/CoCreateJS/socket/compare/v1.4.36...v1.4.37) (2022-12-25)


### Bug Fixes

* bump dependencies ([1306a2e](https://github.com/CoCreateJS/socket/commit/1306a2e2d310274446ae9cd12c31fe27c23deafa))

## [1.4.36](https://github.com/CoCreateJS/socket/compare/v1.4.35...v1.4.36) (2022-12-23)


### Bug Fixes

* bump dependnecies ([24d9424](https://github.com/CoCreateJS/socket/commit/24d9424b58fb5e42711ebcc4a19ab2a80e82e044))

## [1.4.35](https://github.com/CoCreateJS/socket/compare/v1.4.34...v1.4.35) (2022-12-22)


### Bug Fixes

* bump dependencies ([b6d5c0a](https://github.com/CoCreateJS/socket/commit/b6d5c0a19140f1374337e0e7de698a0f22d686ac))

## [1.4.34](https://github.com/CoCreateJS/socket/compare/v1.4.33...v1.4.34) (2022-12-22)


### Bug Fixes

* update demos and bump dependencies ([cb9c829](https://github.com/CoCreateJS/socket/commit/cb9c829b418d3f68842168ab2b340cf72bd3c167))

## [1.4.33](https://github.com/CoCreateJS/socket/compare/v1.4.32...v1.4.33) (2022-12-21)


### Bug Fixes

* bump dependencies ([0d0d214](https://github.com/CoCreateJS/socket/commit/0d0d214e741e987a9ef28417f5d5d9b004876bf0))
* reduce message userStatus ([4f9ba84](https://github.com/CoCreateJS/socket/commit/4f9ba847cd7cfa684f898907fdca58308b54484d))

## [1.4.32](https://github.com/CoCreateJS/socket/compare/v1.4.31...v1.4.32) (2022-12-20)


### Bug Fixes

* bump dependencies ([caa7eec](https://github.com/CoCreateJS/socket/commit/caa7eec54b9d8933650d5eea8355d5bcef725f24))

## [1.4.31](https://github.com/CoCreateJS/socket/compare/v1.4.30...v1.4.31) (2022-12-13)


### Bug Fixes

* bump dependencies ([4f47361](https://github.com/CoCreateJS/socket/commit/4f4736177236cb4f197faee2fb9d117a6b1b43be))

## [1.4.30](https://github.com/CoCreateJS/socket/compare/v1.4.29...v1.4.30) (2022-12-12)


### Bug Fixes

* bump dependencies ([05ddd4c](https://github.com/CoCreateJS/socket/commit/05ddd4c0037bfef37844cc3cc989fbc980245089))

## [1.4.29](https://github.com/CoCreateJS/socket/compare/v1.4.28...v1.4.29) (2022-12-11)


### Bug Fixes

* bump dependencies ([2cbe7e7](https://github.com/CoCreateJS/socket/commit/2cbe7e7f648d573488036d992c5b06b1dc0385c0))

## [1.4.28](https://github.com/CoCreateJS/socket/compare/v1.4.27...v1.4.28) (2022-12-09)


### Bug Fixes

* bump dependencies ([1c9feac](https://github.com/CoCreateJS/socket/commit/1c9feac95712fe4d506f40a48630e7265d41155e))

## [1.4.27](https://github.com/CoCreateJS/socket/compare/v1.4.26...v1.4.27) (2022-12-09)


### Bug Fixes

* bump @cocreate/indexdb ([7fe444f](https://github.com/CoCreateJS/socket/commit/7fe444f6143fc6ca4c7034e95278fb2d3b07af59))

## [1.4.26](https://github.com/CoCreateJS/socket/compare/v1.4.25...v1.4.26) (2022-12-09)


### Bug Fixes

* bump @cocreate/indexdb ([d8a43f8](https://github.com/CoCreateJS/socket/commit/d8a43f86832108f1ead1153afae9ee6397309e16))

## [1.4.25](https://github.com/CoCreateJS/socket/compare/v1.4.24...v1.4.25) (2022-12-08)


### Bug Fixes

* remove commented code ([ec77bb2](https://github.com/CoCreateJS/socket/commit/ec77bb2261c5887894d9c6cec5b0065e57499c63))

## [1.4.24](https://github.com/CoCreateJS/socket/compare/v1.4.23...v1.4.24) (2022-12-08)


### Bug Fixes

* bump dependencies ([97ff9c3](https://github.com/CoCreateJS/socket/commit/97ff9c3b914000286983d8ae1d68ecf105d8f5cf))

## [1.4.23](https://github.com/CoCreateJS/socket/compare/v1.4.22...v1.4.23) (2022-12-07)


### Bug Fixes

* bump dependencies ([c1c8b08](https://github.com/CoCreateJS/socket/commit/c1c8b087640dbb5fc7cd5e9d82a82baed29fef0b))

## [1.4.22](https://github.com/CoCreateJS/socket/compare/v1.4.21...v1.4.22) (2022-12-07)


### Bug Fixes

* bump @cocreate/utils and @cocreate/indexeddb ([f76913e](https://github.com/CoCreateJS/socket/commit/f76913e4f538e309a324fe5cf944dda6383fe7e2))

## [1.4.21](https://github.com/CoCreateJS/socket/compare/v1.4.20...v1.4.21) (2022-12-07)


### Bug Fixes

* syncServer trigers action createDocument ([608e390](https://github.com/CoCreateJS/socket/commit/608e3907e542622c309502a91a08a76a071a4abf))

## [1.4.20](https://github.com/CoCreateJS/socket/compare/v1.4.19...v1.4.20) (2022-12-07)


### Bug Fixes

* comment syncServer requires security improvements ([60f73de](https://github.com/CoCreateJS/socket/commit/60f73ded3927f7c6a5005b0f339e846ead920c2e))

## [1.4.19](https://github.com/CoCreateJS/socket/compare/v1.4.18...v1.4.19) (2022-12-07)


### Bug Fixes

* organization_id ([37b7b72](https://github.com/CoCreateJS/socket/commit/37b7b72918fdd6a28ec04b1b26a1822d2d36e1e3))

## [1.4.18](https://github.com/CoCreateJS/socket/compare/v1.4.17...v1.4.18) (2022-12-04)


### Bug Fixes

* bump dependencies ([da7ed6e](https://github.com/CoCreateJS/socket/commit/da7ed6eec6350c6fdddfadbf8212b6e6709d5c72))

## [1.4.17](https://github.com/CoCreateJS/socket/compare/v1.4.16...v1.4.17) (2022-12-02)


### Bug Fixes

* docs ([f3eda73](https://github.com/CoCreateJS/socket/commit/f3eda731fcdceb9f6365be23836f07688b01f142))

## [1.4.16](https://github.com/CoCreateJS/socket/compare/v1.4.15...v1.4.16) (2022-12-02)


### Bug Fixes

* add data.uid if does not exist ([8f82de8](https://github.com/CoCreateJS/socket/commit/8f82de806d8fe30f5c59abccfd5e5958a2c14018))
* bump dependencies ([553a695](https://github.com/CoCreateJS/socket/commit/553a69586a368310d5b5e6e1f24b4871ae9c90b0))
* renamed module to action ([9526e0c](https://github.com/CoCreateJS/socket/commit/9526e0c3cabfcabf8945615f978a060e690df09d))

## [1.4.15](https://github.com/CoCreateJS/socket/compare/v1.4.14...v1.4.15) (2022-11-28)


### Bug Fixes

* bump dependencies ([8740628](https://github.com/CoCreateJS/socket/commit/8740628f73b01d8b44192605dfb0d90ef37e886a))

## [1.4.14](https://github.com/CoCreateJS/socket/compare/v1.4.13...v1.4.14) (2022-11-28)


### Bug Fixes

* bump dependencies ([8143014](https://github.com/CoCreateJS/socket/commit/81430143e4542976c385dc5beaa3cc5567c145e3))

## [1.4.13](https://github.com/CoCreateJS/socket/compare/v1.4.12...v1.4.13) (2022-11-27)


### Bug Fixes

* bump dependencies ([1badff4](https://github.com/CoCreateJS/socket/commit/1badff44f1d0c1824c180f0f748ab5da997aadc4))

## [1.4.12](https://github.com/CoCreateJS/socket/compare/v1.4.11...v1.4.12) (2022-11-27)


### Bug Fixes

* bump indexeddb ([10e9e3b](https://github.com/CoCreateJS/socket/commit/10e9e3b66a26f18c5a82315b4fb8fabdf0e89d61))

## [1.4.11](https://github.com/CoCreateJS/socket/compare/v1.4.10...v1.4.11) (2022-11-26)


### Bug Fixes

* bump dependencies ([924384c](https://github.com/CoCreateJS/socket/commit/924384cf6cd822ea64558a47d907090b84385170))

## [1.4.10](https://github.com/CoCreateJS/socket/compare/v1.4.9...v1.4.10) (2022-11-25)


### Bug Fixes

* bump dependencies ([4c2636a](https://github.com/CoCreateJS/socket/commit/4c2636ad9eaaa4691cd8c61a162894404caf03c4))

## [1.4.9](https://github.com/CoCreateJS/socket/compare/v1.4.8...v1.4.9) (2022-11-24)


### Bug Fixes

* bump depenedencies ([f51524f](https://github.com/CoCreateJS/socket/commit/f51524f274b99cf482818fca99e9454184017f25))

## [1.4.8](https://github.com/CoCreateJS/socket/compare/v1.4.7...v1.4.8) (2022-11-23)


### Bug Fixes

* bumped [@cocreate](https://github.com/cocreate) dependencies ([57132d5](https://github.com/CoCreateJS/socket/commit/57132d57e38a9fd259bfa6f3aa37af907e5d1f5e))

## [1.4.7](https://github.com/CoCreateJS/socket/compare/v1.4.6...v1.4.7) (2022-11-22)


### Bug Fixes

* apply src: {{source}} to CoCreate.config ([97f6771](https://github.com/CoCreateJS/socket/commit/97f67715246540c140f2df48a72fb16a789e957e))
* workflow docs ([1392cde](https://github.com/CoCreateJS/socket/commit/1392cdef2d834be7bbdcf90f151c719937ebf2f7))

## [1.4.6](https://github.com/CoCreateJS/socket/compare/v1.4.5...v1.4.6) (2022-11-21)


### Bug Fixes

* @cocreate/docs bug fix ([338cce3](https://github.com/CoCreateJS/socket/commit/338cce312bf188454e700bbdb2b37686a612cbd1))

## [1.4.5](https://github.com/CoCreateJS/socket/compare/v1.4.4...v1.4.5) (2022-11-21)


### Bug Fixes

* replaced document_id with document._id ([d31acd6](https://github.com/CoCreateJS/socket/commit/d31acd65e8ce15bcc82d52c74484d694885149eb))

## [1.4.4](https://github.com/CoCreateJS/socket/compare/v1.4.3...v1.4.4) (2022-11-21)


### Bug Fixes

* bump [@cocreate](https://github.com/cocreate) dependencies ([ddbab3e](https://github.com/CoCreateJS/socket/commit/ddbab3e4bab1f95f8bfc048e0cfc244f4e336c75))

## [1.4.3](https://github.com/CoCreateJS/socket/compare/v1.4.2...v1.4.3) (2022-11-21)


### Bug Fixes

* bump [@cocreate](https://github.com/cocreate) dependencies ([fc63f1a](https://github.com/CoCreateJS/socket/commit/fc63f1a7474206a12cc4450eeaee869c43ee8d11))
* emit userStatus was in wrong location preventing it from firing ([3978852](https://github.com/CoCreateJS/socket/commit/3978852bdee59ca1f2d7913bb8ad4961c83c4f35))
* status renamed to userStatus ([7400b16](https://github.com/CoCreateJS/socket/commit/7400b160d3779e8b56fe8f8a72e4dab58ba97052))

## [1.4.2](https://github.com/CoCreateJS/socket/compare/v1.4.1...v1.4.2) (2022-10-01)


### Bug Fixes

* bump [@cocreate](https://github.com/cocreate) dependencies ([6ba746a](https://github.com/CoCreateJS/socket/commit/6ba746a2ff0f25053d9eedd7e05ccaac1fba6909))

## [1.4.1](https://github.com/CoCreateJS/socket/compare/v1.4.0...v1.4.1) (2022-10-01)


### Bug Fixes

* bump dependencies ([c050ba6](https://github.com/CoCreateJS/socket/commit/c050ba6c58c9eca2dfe0a33c4d37dc5aa157bded))

# [1.4.0](https://github.com/CoCreateJS/socket/compare/v1.3.4...v1.4.0) (2022-09-28)


### Bug Fixes

* asyncMessages.delete ([d24d0de](https://github.com/CoCreateJS/socket/commit/d24d0de90b7a99b3bbcd84fece5ce86728f68260))
* broadcast params reduced to socket, message, data. emit updateUserStatus ([bfc40a7](https://github.com/CoCreateJS/socket/commit/bfc40a754e7f55f23febaaa15534aed3d7ce30ae))
* bump ws version to 7.5.9 ([910c246](https://github.com/CoCreateJS/socket/commit/910c246153f4259af25d19901b4f0a6a30866174))
* remove param socketInfo when emitting userStatus ([ae45514](https://github.com/CoCreateJS/socket/commit/ae45514f1c9435ba0d8217d2c13bc3f9df31d7d7))
* replaced socketInfo with socket.config ([0e2b047](https://github.com/CoCreateJS/socket/commit/0e2b047419313eb4e8023991ae9be4140d80a551))


### Features

* config is now accessible from socket.config ([549ea18](https://github.com/CoCreateJS/socket/commit/549ea18180e64a4df9769774881c08a8a5b1cc17))

## [1.3.4](https://github.com/CoCreateJS/socket/compare/v1.3.3...v1.3.4) (2022-09-01)


### Bug Fixes

* bump dependencies ([f2acaae](https://github.com/CoCreateJS/socket/commit/f2acaae991750822923268baa3daf1a56db9f901))

## [1.3.3](https://github.com/CoCreateJS/socket/compare/v1.3.2...v1.3.3) (2022-08-31)


### Bug Fixes

* renamed variable broadcast_sender to broadcastSender ([752c5f6](https://github.com/CoCreateJS/socket/commit/752c5f6b7ce850ab81883ee39ace9922093bcf5b))

## [1.3.2](https://github.com/CoCreateJS/socket/compare/v1.3.1...v1.3.2) (2022-07-25)


### Bug Fixes

* replaced attribute pass-fetch_value with pass-filter-value ([8697c35](https://github.com/CoCreateJS/socket/commit/8697c354bcb07da03a9aaf08ac4e019ebf1a492c))

## [1.3.1](https://github.com/CoCreateJS/socket/compare/v1.3.0...v1.3.1) (2022-05-17)


### Bug Fixes

* get orgId from socketInfo ([481821e](https://github.com/CoCreateJS/socket/commit/481821ecf9a53bc9618d8bb87b11f4509270aced))

# [1.3.0](https://github.com/CoCreateJS/socket/compare/v1.2.2...v1.3.0) (2022-05-14)


### Features

* function readDocumentList has been renamed to readDocuments ([f4714c0](https://github.com/CoCreateJS/socket/commit/f4714c060d169076b47a94493e11eb6b847194e3))

## [1.2.2](https://github.com/CoCreateJS/socket/compare/v1.2.1...v1.2.2) (2022-05-06)


### Bug Fixes

* update config organization_Id to organization_id ([2aa908d](https://github.com/CoCreateJS/socket/commit/2aa908d940c5a8ccef5faa79ea5658a84270257b))

## [1.2.1](https://github.com/CoCreateJS/socket/compare/v1.2.0...v1.2.1) (2022-03-22)


### Bug Fixes

* removed testing console.logs ([48358eb](https://github.com/CoCreateJS/socket/commit/48358eb3939e60c9401defb774161cbd65b6e774))

# [1.2.0](https://github.com/CoCreateJS/socket/compare/v1.1.13...v1.2.0) (2022-03-06)


### Bug Fixes

* broadcast_sender if condition ([663da41](https://github.com/CoCreateJS/socket/commit/663da417cb127048a5bf7be92b3988ba88c9ad37))
* removed querystring dependancy ([340b131](https://github.com/CoCreateJS/socket/commit/340b13124fc3d222cdd57c0b20db0913a71eb807))
* update param roomInfo to socketInfo ([7d651d6](https://github.com/CoCreateJS/socket/commit/7d651d65b1299b18499559a747eba6b10395ef00))
* update param ws to socket for convetion purposes ([17e5989](https://github.com/CoCreateJS/socket/commit/17e598940acec73286465c5947a9b9b9d58b0c56))


### Features

* broadcast supports multiple rooms ([a8edf12](https://github.com/CoCreateJS/socket/commit/a8edf125e0b925e597bd54f7179e1c9aae3b39c3))

## [1.1.13](https://github.com/CoCreateJS/socket/compare/v1.1.12...v1.1.13) (2022-03-03)


### Bug Fixes

* removed emit changeDB ([cde4d9f](https://github.com/CoCreateJS/socket/commit/cde4d9f6f74d7cbf536eddb4a87436cc315e07fe))
* update pakage.json main to src/index ([4188d9c](https://github.com/CoCreateJS/socket/commit/4188d9c65ef461c26cc7ea3e12d8216f20183ea5))

## [1.1.12](https://github.com/CoCreateJS/socket/compare/v1.1.11...v1.1.12) (2022-02-28)


### Bug Fixes

* update param requestData.action to requestData.module ([8a1a7e0](https://github.com/CoCreateJS/socket/commit/8a1a7e0b7eb14c948973c42e97911781e91b9e53))
* wildcard permission for docs domain ([7a0d5cd](https://github.com/CoCreateJS/socket/commit/7a0d5cd1ca0cc275e28362333addd8c3a35b15b3))

## [1.1.11](https://github.com/CoCreateJS/socket/compare/v1.1.10...v1.1.11) (2022-02-16)


### Bug Fixes

* update dependencies ([b8d3cb3](https://github.com/CoCreateJS/socket/commit/b8d3cb38658d58b85d127bb68a3beab5781e0128))

## [1.1.10](https://github.com/CoCreateJS/socket/compare/v1.1.9...v1.1.10) (2022-02-09)


### Bug Fixes

* add document_id to CoCreate.config ([dbe4c05](https://github.com/CoCreateJS/socket/commit/dbe4c05864aab9f2cd81d5b3754f9ec23a28d087))

## [1.1.9](https://github.com/CoCreateJS/socket/compare/v1.1.8...v1.1.9) (2022-02-09)


### Bug Fixes

* update CoCreate.config.js, bump @cocreate/docs version ([7338129](https://github.com/CoCreateJS/socket/commit/73381299f837b4cae092bdd2272c7f47d5eef740))

## [1.1.8](https://github.com/CoCreateJS/socket/compare/v1.1.7...v1.1.8) (2021-11-11)


### Bug Fixes

* licensing information ([db7ffb0](https://github.com/CoCreateJS/socket/commit/db7ffb0c4cf5b01282a90956e593c9509b4ff801))
* update readme ([ae9401f](https://github.com/CoCreateJS/socket/commit/ae9401fbe482d01c39074a9612c805c7c5d9596b))

## [1.1.7](https://github.com/CoCreateJS/socket/compare/v1.1.6...v1.1.7) (2021-11-11)


### Bug Fixes

* update .gitignore ([2783c9a](https://github.com/CoCreateJS/socket/commit/2783c9a464bf0c930099d9ac0ca65a8a5f7ab41c))

## [1.1.6](https://github.com/CoCreateJS/socket/compare/v1.1.5...v1.1.6) (2021-11-01)


### Bug Fixes

* add apikey.js ([9d73042](https://github.com/CoCreateJS/socket/commit/9d73042e5e0e274b990d1a76a0de0e5fed7bea74))

## [1.1.5](https://github.com/CoCreateJS/socket/compare/v1.1.4...v1.1.5) (2021-08-13)


### Bug Fixes

* filetodb consolelog and data- removed ([2a5e351](https://github.com/CoCreateJS/socket/commit/2a5e351967eb48a7437a00a85f7a3f88d08b8f07))

## [1.1.4](https://github.com/CoCreateJS/socket/compare/v1.1.3...v1.1.4) (2021-07-28)


### Bug Fixes

* removed data- from crud, fetch, filter and pass attributes ([54d593a](https://github.com/CoCreateJS/socket/commit/54d593ab4fc2d71e04ca52e154260808e45194c8))
