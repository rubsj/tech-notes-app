import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { BreadCrumbPathMapping } from '../pages/layout';
import { BreadCrumb } from '../pages/types';

export const getBreadCrumbs = (path: string): BreadCrumb[] => {
  let currentLink = '';
  console.log('path ', path, 'crumbs ', path.split('/'));
  const homeCrumb: BreadCrumb = {
    link: '/',
    label: BreadCrumbPathMapping.get('/') ?? 'Label Not Found'
  };
  let crumbs: BreadCrumb[] = path
    .split('/')
    .filter((crumb) => crumb !== '')
    .map((crumb) => {
      currentLink = `${currentLink}/${crumb}`;
      return {
        link: currentLink,
        label: BreadCrumbPathMapping.get(currentLink) ?? 'Label Not Found'
      };
    });

  crumbs = [homeCrumb, ...crumbs];

  return crumbs;
};

export const useBreadCrumbs = () => {
  const location = useLocation();
  const [breadCrumbs, setBreadCrumbs] = useState<BreadCrumb[]>([]);
  useEffect(() => {
    const crumbs = getBreadCrumbs(location.pathname);
    setBreadCrumbs(crumbs);
  }, [location]);

  return breadCrumbs;
};
