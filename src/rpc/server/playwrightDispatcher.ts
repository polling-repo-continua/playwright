/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Playwright } from '../../server/playwright';
import { PlaywrightChannel, PlaywrightInitializer } from '../channels';
import { BrowserTypeDispatcher } from './browserTypeDispatcher';
import { Dispatcher, DispatcherScope } from './dispatcher';
import { SelectorsDispatcher } from './selectorsDispatcher';
import { Electron } from '../../server/electron';
import { ElectronDispatcher } from './electronDispatcher';

export class PlaywrightDispatcher extends Dispatcher<Playwright, PlaywrightInitializer> implements PlaywrightChannel {
  constructor(scope: DispatcherScope, playwright: Playwright) {
    const electron = (playwright as any).electron as (Electron | undefined);
    const deviceDescriptors = Object.entries(playwright.devices)
        .map(([name, descriptor]) => ({ name, descriptor }));
    super(scope, playwright, 'Playwright', {
      chromium: new BrowserTypeDispatcher(scope, playwright.chromium!),
      firefox: new BrowserTypeDispatcher(scope, playwright.firefox!),
      webkit: new BrowserTypeDispatcher(scope, playwright.webkit!),
      electron: electron ? new ElectronDispatcher(scope, electron) : undefined,
      deviceDescriptors,
      selectors: new SelectorsDispatcher(scope, playwright.selectors),
    }, false, 'Playwright');
  }
}
