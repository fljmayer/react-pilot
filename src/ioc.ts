import { Container } from "inversify";
import "reflect-metadata";
import getDecorators from "inversify-inject-decorators";

import { ContentService } from './services/ContentService';

export const container = new Container();
export const { lazyInject } = getDecorators(container);

container.bind<ContentService>("contentService").to(ContentService);
