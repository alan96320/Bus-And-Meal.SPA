import { BusOrderEntry } from '../_models/busOrderEntry';
import { DormitoryBlock } from '../_models/dormitoryBlock';
import { BusTime } from '../_models/busTime';

export interface BusOrder {
  busorder: BusOrderEntry[];
  dormitoryblock: DormitoryBlock[];
  bustime: BusTime[];
  direction: Direction[];
}

export interface Direction {
  id: number;
  name: string;
}
