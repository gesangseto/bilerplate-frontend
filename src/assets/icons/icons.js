// Deep import per ikon. Mengimpor dari index "@coreui/icons" menarik SEMUA
// ~1591 ikon (~13,7 MB di bundle dev) karena dev tidak tree-shake. Dengan
// impor langsung ke file ikon, hanya ikon yang dipakai yang ikut ke bundle.
import { cibFacebook } from '@coreui/icons/dist/esm/brand/cib-facebook.js';
import { cibWhatsapp } from '@coreui/icons/dist/esm/brand/cib-whatsapp.js';
import { cibTwitter } from '@coreui/icons/dist/esm/brand/cib-twitter.js';
import { cibLinkedin } from '@coreui/icons/dist/esm/brand/cib-linkedin.js';
import { cibFlickr } from '@coreui/icons/dist/esm/brand/cib-flickr.js';
import { cibTumblr } from '@coreui/icons/dist/esm/brand/cib-tumblr.js';
import { cibXing } from '@coreui/icons/dist/esm/brand/cib-xing.js';
import { cibGithub } from '@coreui/icons/dist/esm/brand/cib-github.js';
import { cibYoutube } from '@coreui/icons/dist/esm/brand/cib-youtube.js';
import { cibDribbble } from '@coreui/icons/dist/esm/brand/cib-dribbble.js';
import { cibInstagram } from '@coreui/icons/dist/esm/brand/cib-instagram.js';
import { cibPinterest } from '@coreui/icons/dist/esm/brand/cib-pinterest.js';
import { cibVk } from '@coreui/icons/dist/esm/brand/cib-vk.js';
import { cibYahoo } from '@coreui/icons/dist/esm/brand/cib-yahoo.js';
import { cibBehance } from '@coreui/icons/dist/esm/brand/cib-behance.js';
import { cibReddit } from '@coreui/icons/dist/esm/brand/cib-reddit.js';
import { cibVimeo } from '@coreui/icons/dist/esm/brand/cib-vimeo.js';
import { cibCcMastercard } from '@coreui/icons/dist/esm/brand/cib-cc-mastercard.js';
import { cibCcVisa } from '@coreui/icons/dist/esm/brand/cib-cc-visa.js';
import { cibStripe } from '@coreui/icons/dist/esm/brand/cib-stripe.js';
import { cibPaypal } from '@coreui/icons/dist/esm/brand/cib-paypal.js';
import { cibGooglePay } from '@coreui/icons/dist/esm/brand/cib-google-pay.js';
import { cibCcAmex } from '@coreui/icons/dist/esm/brand/cib-cc-amex.js';
import { cibSuperuser } from '@coreui/icons/dist/esm/brand/cib-superuser.js';
import { cifUs } from '@coreui/icons/dist/esm/flag/cif-us.js';
import { cifBr } from '@coreui/icons/dist/esm/flag/cif-br.js';
import { cifIn } from '@coreui/icons/dist/esm/flag/cif-in.js';
import { cifFr } from '@coreui/icons/dist/esm/flag/cif-fr.js';
import { cifEs } from '@coreui/icons/dist/esm/flag/cif-es.js';
import { cifPl } from '@coreui/icons/dist/esm/flag/cif-pl.js';
import { cilSync } from '@coreui/icons/dist/esm/free/cil-sync.js';
import { cilWindowRestore } from '@coreui/icons/dist/esm/free/cil-window-restore.js';
import { cilWarning } from '@coreui/icons/dist/esm/free/cil-warning.js';
import { cilArrowRight } from '@coreui/icons/dist/esm/free/cil-arrow-right.js';
import { cilBan } from '@coreui/icons/dist/esm/free/cil-ban.js';
import { cilBasket } from '@coreui/icons/dist/esm/free/cil-basket.js';
import { cilBell } from '@coreui/icons/dist/esm/free/cil-bell.js';
import { cilBlurLinear } from '@coreui/icons/dist/esm/free/cil-blur-linear.js';
import { cilCalculator } from '@coreui/icons/dist/esm/free/cil-calculator.js';
import { cilCalendar } from '@coreui/icons/dist/esm/free/cil-calendar.js';
import { cilCloudDownload } from '@coreui/icons/dist/esm/free/cil-cloud-download.js';
import { cilChartPie } from '@coreui/icons/dist/esm/free/cil-chart-pie.js';
import { cilCheck } from '@coreui/icons/dist/esm/free/cil-check.js';
import { cilChevronBottom } from '@coreui/icons/dist/esm/free/cil-chevron-bottom.js';
import { cilChevronTop } from '@coreui/icons/dist/esm/free/cil-chevron-top.js';
import { cilCheckCircle } from '@coreui/icons/dist/esm/free/cil-check-circle.js';
import { cilCommentSquare } from '@coreui/icons/dist/esm/free/cil-comment-square.js';
import { cilCursor } from '@coreui/icons/dist/esm/free/cil-cursor.js';
import { cilDrop } from '@coreui/icons/dist/esm/free/cil-drop.js';
import { cilDollar } from '@coreui/icons/dist/esm/free/cil-dollar.js';
import { cilEnvelopeClosed } from '@coreui/icons/dist/esm/free/cil-envelope-closed.js';
import { cilEnvelopeOpen } from '@coreui/icons/dist/esm/free/cil-envelope-open.js';
import { cilEuro } from '@coreui/icons/dist/esm/free/cil-euro.js';
import { cilGlobeAlt } from '@coreui/icons/dist/esm/free/cil-globe-alt.js';
import { cilGrid } from '@coreui/icons/dist/esm/free/cil-grid.js';
import { cilFile } from '@coreui/icons/dist/esm/free/cil-file.js';
import { cilJustifyCenter } from '@coreui/icons/dist/esm/free/cil-justify-center.js';
import { cilLaptop } from '@coreui/icons/dist/esm/free/cil-laptop.js';
import { cilLayers } from '@coreui/icons/dist/esm/free/cil-layers.js';
import { cilLightbulb } from '@coreui/icons/dist/esm/free/cil-lightbulb.js';
import { cilList } from '@coreui/icons/dist/esm/free/cil-list.js';
import { cilLocationPin } from '@coreui/icons/dist/esm/free/cil-location-pin.js';
import { cilLockLocked } from '@coreui/icons/dist/esm/free/cil-lock-locked.js';
import { cilMagnifyingGlass } from '@coreui/icons/dist/esm/free/cil-magnifying-glass.js';
import { cilMoney } from '@coreui/icons/dist/esm/free/cil-money.js';
import { cilMoon } from '@coreui/icons/dist/esm/free/cil-moon.js';
import { cilOptions } from '@coreui/icons/dist/esm/free/cil-options.js';
import { cilPencil } from '@coreui/icons/dist/esm/free/cil-pencil.js';
import { cilPeople } from '@coreui/icons/dist/esm/free/cil-people.js';
import { cilPuzzle } from '@coreui/icons/dist/esm/free/cil-puzzle.js';
import { cilSettings } from '@coreui/icons/dist/esm/free/cil-settings.js';
import { cilShieldAlt } from '@coreui/icons/dist/esm/free/cil-shield-alt.js';
import { cilSpeech } from '@coreui/icons/dist/esm/free/cil-speech.js';
import { cilSpeedometer } from '@coreui/icons/dist/esm/free/cil-speedometer.js';
import { cilStar } from '@coreui/icons/dist/esm/free/cil-star.js';
import { cilTask } from '@coreui/icons/dist/esm/free/cil-task.js';
import { cilUser } from '@coreui/icons/dist/esm/free/cil-user.js';
import { cilUserFemale } from '@coreui/icons/dist/esm/free/cil-user-female.js';
import { cilUserFollow } from '@coreui/icons/dist/esm/free/cil-user-follow.js';
import { cilXCircle } from '@coreui/icons/dist/esm/free/cil-x-circle.js';
import { cilTrash } from '@coreui/icons/dist/esm/free/cil-trash.js';
import { cilPlus } from '@coreui/icons/dist/esm/free/cil-plus.js';
import { cilPrint } from '@coreui/icons/dist/esm/free/cil-print.js';
import { cilTruck } from '@coreui/icons/dist/esm/free/cil-truck.js';
import { cilBank } from '@coreui/icons/dist/esm/free/cil-bank.js';
import { cilIndustry } from '@coreui/icons/dist/esm/free/cil-industry.js';
import { cilStorage } from '@coreui/icons/dist/esm/free/cil-storage.js';
import { cilInbox } from '@coreui/icons/dist/esm/free/cil-inbox.js';
import { cilQrCode } from '@coreui/icons/dist/esm/free/cil-qr-code.js';
import { cilApplications } from '@coreui/icons/dist/esm/free/cil-applications.js';
import { cilDoor } from '@coreui/icons/dist/esm/free/cil-door.js';
import { cilCloudUpload } from '@coreui/icons/dist/esm/free/cil-cloud-upload.js';
import { cilLibrary } from '@coreui/icons/dist/esm/free/cil-library.js';
import { cilArrowLeft } from '@coreui/icons/dist/esm/free/cil-arrow-left.js';
import { cilBarChart } from '@coreui/icons/dist/esm/free/cil-bar-chart.js';
import { cilActionUndo } from '@coreui/icons/dist/esm/free/cil-action-undo.js';
import { cilTags } from '@coreui/icons/dist/esm/free/cil-tags.js';
import { cilCreditCard } from '@coreui/icons/dist/esm/free/cil-credit-card.js';
import { cil3d } from '@coreui/icons/dist/esm/free/cil-3d.js';
import { cilSpreadsheet } from '@coreui/icons/dist/esm/free/cil-spreadsheet.js';
import { cilSwapHorizontal } from '@coreui/icons/dist/esm/free/cil-swap-horizontal.js';
import { cilClipboard } from '@coreui/icons/dist/esm/free/cil-clipboard.js';
import { cilRoom } from '@coreui/icons/dist/esm/free/cil-room.js';
import { logo } from './logo';

export const iconsSet = Object.assign(
  {},
  { logo },
  {
    cilSync,
    cilWindowRestore,
    cilWarning,
    cilArrowRight,
    cilBan,
    cilBasket,
    cilBell,
    cilBlurLinear,
    cilCalculator,
    cilCalendar,
    cilCloudDownload,
    cilChartPie,
    cilCheck,
    cilChevronBottom,
    cilChevronTop,
    cilCheckCircle,
    cilCommentSquare,
    cilCursor,
    cilDrop,
    cilDollar,
    cilEnvelopeClosed,
    cilEnvelopeOpen,
    cilEuro,
    cilGlobeAlt,
    cilGrid,
    cilFile,
    cilJustifyCenter,
    cilLaptop,
    cilLayers,
    cilLightbulb,
    cilList,
    cilLocationPin,
    cilLockLocked,
    cilMagnifyingGlass,
    cilMoney,
    cilMoon,
    cilOptions,
    cilPencil,
    cilPeople,
    cilPuzzle,
    cilSettings,
    cilShieldAlt,
    cilSpeech,
    cilSpeedometer,
    cilStar,
    cilTask,
    cilUser,
    cilUserFemale,
    cilUserFollow,
    cilXCircle,
    cilTrash,
    cilPlus,
    cilPrint,
    cilTruck,
    cilBank,
    cilIndustry,
    cilStorage,
    cilInbox,
    cilQrCode,
    cilApplications,
    cilDoor,
    cilCloudUpload,
    cilLibrary,
    cilArrowLeft,
    cilBarChart,
    cilActionUndo,
    cilTags,
    cilCreditCard,
    cil3d,
    cilSpreadsheet,
    cilSwapHorizontal,
    cilClipboard,
    cilRoom,
  },
  {
    cifUs,
    cifBr,
    cifIn,
    cifFr,
    cifEs,
    cifPl,
  },
  {
    cibFacebook,
    cibWhatsapp,
    cibSuperuser,
    cibTwitter,
    cibLinkedin,
    cibFlickr,
    cibTumblr,
    cibXing,
    cibGithub,
    cibSuperuser,
    cibYoutube,
    cibDribbble,
    cibInstagram,
    cibPinterest,
    cibVk,
    cibYahoo,
    cibBehance,
    cibReddit,
    cibVimeo,
    cibCcMastercard,
    cibCcVisa,
    cibStripe,
    cibPaypal,
    cibGooglePay,
    cibCcAmex,
  }
);
