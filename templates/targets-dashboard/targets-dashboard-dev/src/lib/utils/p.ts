function p(path: string) {
  return process.env.NODE_ENV === 'development'
    ? `/${path}`
    : `/wp-content/plugins/pat/templates/targets-dashboard/dist/${path}`;
}

export default p;
