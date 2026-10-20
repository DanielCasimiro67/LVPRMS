import {createRepository} from '../../js/store.js';
import {seedState} from '../../js/data.js';
export function createDemoAdapter({storage=globalThis.localStorage}={}){
 const repository=createRepository({storage,seed:seedState});
 return {read:repository.readState,commit:repository.commit,repository};
}
