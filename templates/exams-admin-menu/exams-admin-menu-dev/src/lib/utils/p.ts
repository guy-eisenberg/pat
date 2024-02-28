function p(path: string) {
  return process.env.NODE_ENV === 'development'
    ? `/${path}`
    : `/wp-content/plugins/pat/templates/exams-admin-menu/dist/${path}`;
}

export default p;
