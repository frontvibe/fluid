// https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069

import type {MetaDescriptor} from 'react-router';
import type {GetAnnotations} from 'react-router/internal';

type MetaDescriptors = MetaDescriptor[];

export function mergeRouteModuleMeta<
  TMetaArgs extends GetAnnotations<any>['MetaArgs'],
>(
  leafMetaFn: (args: TMetaArgs) => MetaDescriptors,
): (args: TMetaArgs) => MetaDescriptors {
  return (args) => {
    const leafMeta = leafMetaFn(args);

    return args.matches.reduceRight((acc, match) => {
      for (const parentMeta of match?.meta ?? []) {
        addUniqueMeta(acc, parentMeta);
      }

      return acc;
    }, leafMeta);
  };
}

function addUniqueMeta(
  acc: MetaDescriptor[] | undefined,
  parentMeta: MetaDescriptor,
) {
  if (acc?.findIndex((meta) => isMetaEqual(meta, parentMeta)) === -1) {
    acc.push(parentMeta);
  }
}

function isMetaEqual(meta1: MetaDescriptor, meta2: MetaDescriptor): boolean {
  return (
    ('name' in meta1 && 'name' in meta2 && meta1.name === meta2.name) ||
    ('property' in meta1 &&
      'property' in meta2 &&
      meta1.property === meta2.property) ||
    ('title' in meta1 && 'title' in meta2)
  );
}
