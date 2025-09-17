export default defineNuxtPlugin(() => {
  function hitungDPP(total, tarifPersen) {
    if (!tarifPersen || tarifPersen === 0) return total
    return (total / (1 + (tarifPersen / 100))).toFixed(2)
  }

  function hitungPPN(total, tarifPersen) {
    if (!tarifPersen || tarifPersen === 0) return 0
    const dpp = hitungDPP(total, tarifPersen)
    return total - dpp
  }

  function hitungTotal(dpp, tarifPersen) {
    if (!tarifPersen || tarifPersen === 0) return dpp
    return dpp * (1 + tarifPersen / 100)
  }

  return {
    provide: {
      ppn: {
        hitungDPP,
        hitungPPN,
        hitungTotal,
      },
    },
  }
})
