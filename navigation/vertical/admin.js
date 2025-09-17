export default [
  { heading: 'Admin' },
  {
    title: 'Citra Interior',
    icon: { icon: 'tabler-building' },
    children: [
      // { title: 'Dashboard', to: 'apps-cii-dashboard' },
      { title: 'Daftar Surat', to: 'admin-CII' },
      { title: 'Tambah Surat', to: 'admin-CII-add' },
      { title: 'Request', to: 'admin-CII-request' },
      { title: 'Surat Terhapus', to: 'admin-CII-deleted' },
    ],

  },

  {
    title: 'Citra Furniture',
    icon: { icon: 'tabler-building' },
    children: [
      // { title: 'Dashboard', to: 'admin-cii-dashboard' },
      { title: 'Beranda Surat', to: 'admin-CF' },
      { title: 'Arsip Surat', to: 'admin-CF-lists' },
      { title: 'Tambah Surat', to: 'admin-CF-add' },
      { title: 'Request', to: 'admin-CF-request' },
      { title: 'Surat Terhapus', to: 'admin-CF-deleted' },
    ],

  },
  {
    title: 'Sentral Citra',
    icon: { icon: 'tabler-building' },
    children: [
      // { title: 'Dashboard', to: 'admin-cii-dashboard' },
      { title: 'Beranda Surat', to: 'admin-SCI' },
      { title: 'Arsip Surat', to: 'admin-SCI-lists' },
      { title: 'Tambah Surat', to: 'admin-SCI-add' },
      { title: 'Request', to: 'admin-SCI-request' },
      { title: 'Surat Terhapus', to: 'admin-SCI-deleted' },
    ],

  },
  {
    title: 'Surat Jalan',
    icon: { icon: 'tabler-truck' },
    children: [
      // { title: 'Daftar Memo', to: 'admin-memo-index' },
      { title: 'Daftar Surat', to: 'admin-memo' },
      { title: 'Arsip Surat', to: 'admin-memo' },
      { title: 'Tambah Surat', to: 'admin-memo-add' },
      { title: 'Surat Terhapus', to: 'admin-memo-deleted' },
    ],
  },
  // {
  //   title: 'Faktur',
  //   icon: { icon: 'tabler-receipt-2' },
  //   children: [
  //     { title: 'Daftar Faktur', to: 'admin-faktur' },
  //     { title: 'Tambah Faktur', to: 'admin-faktur-add' },
  //     { title: 'Faktur Terhapus', to: 'admin-faktur-deleted' },
  //   ],
  // },
  {
    title: 'Barang',
    icon: { icon: 'tabler-armchair-2' },
    children: [
      { title: 'Daftar Barang', to: 'admin-barang' },
      { title: 'Barang Terhapus', to: 'admin-barang-deleted' },
    ],
    roles: ['developer', 'superadmin'],
  },
  {
    title: 'Permintaan Faktur',
    icon: { icon: 'tabler-receipt-2' },
    // to: 'admin-faktur',
    children: [
      { title: 'Beranda', to: 'admin-faktur' },
      { title: 'Tambah Permintaan', to: 'admin-faktur-add' },
      { title: 'Daftar Permintaan', to: 'admin-faktur-lists' },
      { title: 'Permintaan Terhapus', to: 'admin-faktur-deleted' },
    ],
  },
  {
    title: 'Supir',
    icon: { icon: 'tabler-user-hexagon' },
    to: 'admin-supir',
    roles: ['developer', 'superadmin'],
  },

]
