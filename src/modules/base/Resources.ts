/**
 * 图片资源文件
 */
import Background from '@/assets/background.png';
import Birds from '@/assets/birds.png';
import Land from '@/assets/land.png';
import PieDown from '@/assets/pie_down.png';
import PieUp from '@/assets/pie_up.png';
import StartButton from '@/assets/start_button.png';

const resource: readonly (readonly [string, string])[] = [
  ['background', Background],
  ['land', Land],
  ['pencilUp', PieUp],
  ['pencilDown', PieDown],
  ['birds', Birds],
  ['startButton', StartButton],
];
export default resource;
