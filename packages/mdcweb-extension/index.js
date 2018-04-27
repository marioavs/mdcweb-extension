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

import * as datePicker from '@mdcext/date-picker';
import * as inputDialog from '@mdcext/input-dialog';
import * as multiselect from '@mdcext/multiselect';
import * as pagination from '@mdcext/pagination';
import * as treeview from '@mdcext/treeview';
import autoInit from '@material/auto-init';

// Register all components
autoInit.register('MDCExtDatePicker', datePicker.MDCExtDatePicker);
autoInit.register('MDCExtInputDialog', inputDialog.MDCExtInputDialog);
autoInit.register('MDCExtMultiselect', multiselect.MDCExtMultiselect);
autoInit.register('MDCExtPagination', pagination.MDCExtPagination);
autoInit.register('MDCExtTreeview', treeview.MDCExtTreeview);

// Export all components.
export {
  datePicker,
  inputDialog,
  multiselect,
  pagination,
  treeview
};
