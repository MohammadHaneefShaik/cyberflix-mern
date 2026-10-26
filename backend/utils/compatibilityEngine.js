// Compatibility engine for PC Builder
export function checkCompatibility(components) {
  const { cpu, motherboard, ram, psu, gpu, cooling } = components;
  const issues = [];
  const warnings = [];
  const ok = [];

  if (cpu && motherboard) {
    if (cpu.socket && motherboard.socket && cpu.socket !== motherboard.socket)
      issues.push(`CPU socket mismatch: ${cpu.name} uses ${cpu.socket} but motherboard supports ${motherboard.socket}`);
    else if (cpu.socket && motherboard.socket)
      ok.push(`CPU and Motherboard share ${cpu.socket} socket`);
  }

  if (cpu && ram && cpu.ramType && ram.ramType && cpu.ramType !== ram.ramType)
    issues.push(`RAM type mismatch: CPU supports ${cpu.ramType} but RAM is ${ram.ramType}`);
  else if (cpu && ram && cpu.ramType && ram.ramType)
    ok.push(`CPU and RAM both use ${ram.ramType}`);

  if (motherboard && ram && motherboard.ramType && ram.ramType && motherboard.ramType !== ram.ramType)
    issues.push(`RAM type mismatch: Motherboard supports ${motherboard.ramType} but RAM is ${ram.ramType}`);

  if (psu) {
    const totalTDP = getTotalTDP(components);
    const recWattage = Math.ceil(totalTDP * 1.3 / 50) * 50;
    if (totalTDP > 0) {
      if (psu.wattage < recWattage) issues.push(`PSU too weak: build needs ~${recWattage}W but PSU is ${psu.wattage}W`);
      else if (psu.wattage > recWattage + 300) warnings.push(`PSU slightly oversized: ${psu.wattage}W vs recommended ${recWattage}W`);
      else ok.push(`PSU provides adequate power (${psu.wattage}W)`);
    }
  }

  if (gpu && psu && gpu.tdp > 300 && psu.wattage < 850)
    warnings.push(`High-TDP GPU (${gpu.tdp}W) — consider 850W+ PSU`);

  if (cpu && !cooling)
    warnings.push(cpu.tdp > 125 ? `High TDP CPU (${cpu.tdp}W) — dedicated cooler strongly recommended` : `No CPU cooler selected — ensure CPU includes boxed cooler`);
  else if (cpu && cooling)
    ok.push(`CPU Cooler selected`);

  if (cpu && !gpu)
    warnings.push(`No GPU selected — ensure CPU has integrated graphics`);

  return { isCompatible: issues.length === 0, issues, warnings, ok };
}

export function getTotalTDP(components) {
  const { cpu, gpu } = components;
  let total = 0;
  if (cpu?.tdp) total += cpu.tdp;
  if (gpu?.tdp) total += gpu.tdp;
  if (Object.keys(components).length > 0) total += 30;
  return total;
}

export function estimatePerformance(components) {
  const { cpu, gpu, ram } = components;
  if (!cpu && !gpu) return { gaming: 0, workstation: 0, general: 0 };
  const gpuScore = gpu ? Math.min(100, Math.round(gpu.price / 2000)) : 10;
  const cpuScore = cpu ? Math.min(100, Math.round(cpu.price / 750)) : 30;
  const ramScore = ram ? Math.min(100, Math.round((ram.ramSpeed || 4800) / 72)) : 50;
  return {
    gaming: Math.min(99, Math.round(gpuScore * 0.65 + cpuScore * 0.25 + ramScore * 0.10)),
    workstation: Math.min(99, Math.round(cpuScore * 0.55 + gpuScore * 0.30 + ramScore * 0.15)),
    general: Math.min(99, Math.round(cpuScore * 0.45 + ramScore * 0.35 + gpuScore * 0.20)),
  };
}
