import { Pilotis } from './Pilotis'
import { FirstFloorSlab, RoofSlab } from './Slabs'
import { Facade } from './Facade'
import { GroundFloor } from './GroundFloor'
import { Ramp } from './Ramp'
import { SpiralStair } from './SpiralStair'
import { RoofGarden } from './RoofGarden'
import { Interior } from './Interior'

/** サヴォア邸 本体(1928–1931, ポワシー) */
export function VillaSavoye() {
  return (
    <group>
      <Pilotis />
      <FirstFloorSlab />
      <RoofSlab />
      <Facade />
      <GroundFloor />
      <Ramp />
      <SpiralStair />
      <RoofGarden />
      <Interior />
    </group>
  )
}
