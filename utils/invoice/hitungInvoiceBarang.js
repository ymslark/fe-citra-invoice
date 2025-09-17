

export function hitungInvoiceBarang(barangList, tarifPPN) {
  let barangs = barangList.map(item => {
    const { harga_akhir, qty, diskon } = item

    // harga sudah termasuk PPN
    const dpp_per_unit = (harga_akhir / (1 + (tarifPPN / 100))).toFixed(2)
    const ppn_per_unit = (harga_akhir - dpp_per_unit).toFixed(2)
    const dpp_tanpa_diskon = (parseFloat(dpp_per_unit) + parseFloat(diskon)).toFixed(2)
    const total_dpp = (dpp_per_unit * qty).toFixed(2)
    const total_dpp_tanpa_diskon = (dpp_tanpa_diskon * qty).toFixed(2)
    const total_ppn = (ppn_per_unit * qty).toFixed(2)
    // const total_akhir = total_awal - total_diskon

    return {
      ...item,
      dpp_per_unit,
      dpp_tanpa_diskon,
      ppn_per_unit,
      total_dpp,
      total_dpp_tanpa_diskon,
      total_ppn,
      // total_diskon,
      // total_akhir
    }
  })
  return {
    barangs,
    dpp: barangs.reduce((sum, item) => sum + parseFloat(item.total_dpp), 0).toFixed(2),
    dpp_tanpa_diskon: barangs.reduce((sum, item) => sum + parseFloat(item.total_dpp_tanpa_diskon), 0).toFixed(2),
    ppn: barangs.reduce((sum, item) => sum + parseFloat(item.total_ppn), 0).toFixed(2),
  }
}
