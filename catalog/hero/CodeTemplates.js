import {ButtonReactTemplate} from '../ButtonCatalog';
import {TreeviewReactTemplate} from '../TreeviewCatalog';
import {TopAppBarReactTemplate} from '../TopAppBarCatalog';

const ReactTemplates = {
  'button': (config) => ButtonReactTemplate(config),
  'top-app-bar': (config) => TopAppBarReactTemplate(config),
  'treeview': (config) => TreeviewReactTemplate(config),
};

export default ReactTemplates;
