/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as autocomplete from '@mdcext/autocomplete';
import * as dataTable from '@mdcext/data-table';
import autoInit from '@material/auto-init';

// let webpack to copy material-components-web js and css
//require('material-components-web/dist/material-components-web')
//require('material-components-web/dist/material-components-web.css')

// Register all components
autoInit.register('MDCExtAutocomplete', autocomplete.MDCExtAutocomplete);
autoInit.register('MDCExtDataTable', dataTable.MDCExtDataTable);

// Export all components.
export {
  autocomplete,
  dataTable
};
