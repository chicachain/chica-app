/* eslint-disable import/order */
import React from 'react';
import { Switch } from 'react-router-dom';
import Errors from '@pages/Errors';
import SignIn from '@pages/Auth/SignIn';
import CertCodeCheck from '@pages/Auth/CertCodeCheck';
import SignUpName from '@pages/Auth/SignUpName'; // 회원가입 이름입력
import SignUpPwd from '@pages/Auth/SignUpPwd'; // 회원가입 비밀번호입력
import SignUpAdd from '@pages/Auth/SignUpAdd'; // 회원가입 로그인 정보저장
import SignUpDay from '@pages/Auth/SignUpDay'; // 회원가입 생년월일 정보저장
import SignUpId from '@pages/Auth/SignUpId'; // 회원가입 아이디입력
import SignUpCheck from '@pages/Auth/SignUpCheck';
import EmailCheck from '@pages/Auth/EmailCheck'; // 회원가입 아이디입력, 봉인인증 아이디 입력
import FindId from '@pages/Auth/FindId';
import FindPwd from '@pages/Auth/FindPwd';
import MatchId from '@pages/Auth/MatchId';
import PwdNew from '@pages/Auth/PwdNew';
// 회원가입후 관심키워드 추천
import KeywordProp from '@pages/Keywords/KeywordProp';
import KeywordGender from '@pages/Keywords/KeywordGender';
import KeywordMenu from '@pages/Keywords/KeywordMenu';
import KeywordPart from '@pages/Keywords/KeywordPart';
import KeywordProFile from '@pages/Keywords/KeywordProFile';

// 메인홈
import Home from '@pages/Home/Home'; // 로그인후 메인홈
import HomeBefor from '@pages/Home/HomeBefor'; // 로그인전
import HomeMap from '@pages/Home/HomeMap';
// 검색
import Search from '@pages/Search/Search';
// 위치
import Place from '@pages/Place/Place';
import PlaceMap from '@pages/Place/PlaceMap';
import PlaceDetail from '@pages/Place/PlaceDetail';
import ReviewDetail from '@pages/Place/ReviewDetail';
import ArtTabMenu from '@pages/Place/ArtTabMenu';
import MapTabMenu from '@pages/Place/MapTabMenu';
import ReviewTabMenu from '@pages/Place/ReviewTabMenu';
import MenuTabMenu from '@pages/Place/MenuTabMenu';
import AroundTabMenu from '@pages/Place/AroundTabMenu';
import EventTabMenu from '@pages/Place/EventTabMenu';
import EventDetail from '@pages/Place/EventDetail';
// 예약하기
import Designer from '@pages/Reservation/Designer';
import SkinMenu from '@pages/Reservation/SkinMenu';
import DaySelect from '@pages/Reservation/DaySelect';
import PayMent from '@pages/Reservation/PayMent';
import Complete from '@pages/Reservation/Complete';
// 커뮤니티
import Community from '@pages/Community/Community';
import CommRe from '@pages/Community/CommRe';
import CommDetail from '@pages/Community/CommDetail';
import CommSchedule from '@pages/Community/CommSchedule';
import CommRevCreate from '@pages/Community/CommRevCreate';
import CommRevModify from '@pages/Community/CommRevModify';
import CommBasCreate from '@pages/Community/CommBasCreate';
import CommBasModify from '@pages/Community/CommBasModify';
import Report from '@pages/Community/Report';
// 내정보
import MyPage from '@pages/MyPage/MyPage';
import Order from '@pages/MyPage/Order';
import OrderDetail from '@pages/MyPage/OrderDetail';
import Setting from '@pages/MyPage/Setting';
import MyPageEdit from '@pages/MyPage/MyPageEdit';
import KeywordMenuEdit from '../pages/MyPage/KeywordMenuEdit';
import KeywordPartEdit from '../pages/MyPage/KeywordPartEdit';
import PwdEdit from '@pages/MyPage/PwdEdit';
import WatchPlace from '@pages/MyPage/WatchPlace';
import WatchExpert from '@pages/MyPage/WatchExpert';
import WatchReview from '@pages/MyPage/WatchReview';
import WatchSet from '@pages/MyPage/WatchSet';
import QnApage from '@pages/MyPage/QnApage';
import MyFollower from '@pages/MyPage/MyFollower';
import UserFollower from '@pages/MyPage/UserFollower';
// 공지사항
import Notice from '@pages/Notice/Notice';
import NoticeDetail from '@pages/Notice/NoticeDetail';
// 이용약관
import Terms from '@pages/Terms/Terms';
import ChicaTerms from '@pages/Terms/ChicaTerms';
import License from '@pages/Terms/License';
import PrivacyPolish from '@pages/Terms/PrivacyPolish';
// 탈퇴하기
import DelAccount from '@pages/DelAccount/DelAccount';
// 레이아웃
import Layout from './Layout';
import AuthLayout from './AuthLayout';
// 지갑
import Wallet from '@pages/Wallet/Wallet';
// 테스트
import CalanderTest from '@pages/test/CalanderTest';
import MapTest from '@pages/test/MapTest';
import WalletShareTest from '@pages/test/WalletShareTest';
import MobileDatePickerTest from '@pages/test/MobileDatePickerTest';
import RouterPath from '../common/constants/RouterPath';

function Router() {
  return (
    <Switch>
      <Layout exact path={RouterPath.slash} component={HomeBefor} />
      <Layout exact path={RouterPath.homebefor} component={HomeBefor} />
      {/* Default ( 로그인 or 아이템현황 )  */}
      <Layout exact path={RouterPath.signIn} component={SignIn} />

      {/* Auth */}
      <Layout exact path={RouterPath.certCodeCheck} component={CertCodeCheck} />

      <Layout exact path={RouterPath.findId} component={FindId} />
      <Layout exact path={RouterPath.matchid} component={MatchId} />
      <Layout exact path={RouterPath.findPwd} component={FindPwd} />
      <Layout exact path={RouterPath.pwdnew} component={PwdNew} />
      <Layout exact path={RouterPath.signupName} component={SignUpName} />
      <Layout exact path={RouterPath.signupPwd} component={SignUpPwd} />
      <Layout exact path={RouterPath.signupCheck} component={SignUpCheck} />
      <Layout exact path={RouterPath.signupBirth} component={SignUpDay} />
      <Layout exact path={RouterPath.signupDay} component={SignUpDay} />
      <Layout exact path={RouterPath.signupAdd} component={SignUpAdd} />
      <Layout exact path={RouterPath.signupId} component={SignUpId} />
      <Layout exact path={RouterPath.emailCheck} component={EmailCheck} />
      {/* 관심키워드 */}
      <AuthLayout exact path={RouterPath.keywordProp} component={KeywordProp} />
      <AuthLayout
        exact
        path={RouterPath.keywordGender}
        component={KeywordGender}
      />
      <AuthLayout exact path={RouterPath.keywordMenu} component={KeywordMenu} />
      <AuthLayout exact path={RouterPath.keywordPart} component={KeywordPart} />
      <AuthLayout
        exact
        path={RouterPath.keywordProfile}
        component={KeywordProFile}
      />
      {/* 메인홈 */}
      <AuthLayout exact path={RouterPath.home} component={Home} />
      <AuthLayout exact path={RouterPath.homeMap} component={HomeMap} />

      {/* 검색페이지 */}
      <AuthLayout exact path={RouterPath.search} component={Search} />
      {/* 위치페이지 */}
      <AuthLayout exact path={RouterPath.place} component={Place} />
      <AuthLayout exact path={RouterPath.placeMap} component={PlaceMap} />
      <AuthLayout
        exact
        path={`${RouterPath.placeDetail}/:shopId`}
        component={PlaceDetail}
      />
      <AuthLayout
        exact
        path={`${RouterPath.placeReviewdetail}/:feedId`}
        component={ReviewDetail}
      />
      <AuthLayout
        exact
        path={`${RouterPath.placeReviewtab}/:shopId`}
        component={ReviewTabMenu}
      />
      <AuthLayout
        exact
        path={`${RouterPath.placeMenutab}/:shopId`}
        component={MenuTabMenu}
      />
      <AuthLayout
        exact
        path={`${RouterPath.placeMapTab}/:shopId`}
        component={MapTabMenu}
      />
      <AuthLayout
        exact
        path={`${RouterPath.placeAroundtab}/:shopId`}
        component={AroundTabMenu}
      />
      <AuthLayout
        path={`${RouterPath.placeArtTab}/:shopId`}
        component={ArtTabMenu}
      />
      <AuthLayout
        path={`${RouterPath.placeEventTab}/:shopId`}
        component={EventTabMenu}
      />
      <AuthLayout
        path={`${RouterPath.eventdetail}/:eventId`}
        component={EventDetail}
      />
      {/* 예약하기 */}
      <AuthLayout
        exact
        path={`${RouterPath.designer}/:shopId`}
        component={Designer}
      />
      <AuthLayout
        exact
        path={`${RouterPath.skinmenu}/:shopId`}
        component={SkinMenu}
      />
      <AuthLayout
        exact
        path={`${RouterPath.dayselect}/:shopId`}
        component={DaySelect}
      />
      <AuthLayout exact path={RouterPath.payment} component={PayMent} />
      <AuthLayout exact path={RouterPath.complete} component={Complete} />
      {/* 커뮤니티 */}
      <AuthLayout exact path={RouterPath.community} component={Community} />
      <AuthLayout exact path={RouterPath.commre} component={CommRe} />
      <AuthLayout exact path={RouterPath.commdetail} component={CommDetail} />
      <AuthLayout
        exact
        path={RouterPath.commschedule}
        component={CommSchedule}
      />
      <AuthLayout
        exact
        path={RouterPath.commrevcreate}
        component={CommRevCreate}
      />
      <AuthLayout
        exact
        path={`${RouterPath.commrevmodify}/:feedId`}
        component={CommRevModify}
      />
      <AuthLayout
        exact
        path={RouterPath.commbascreate}
        component={CommBasCreate}
      />
      <AuthLayout
        exact
        path={`${RouterPath.commbasmodify}/:feedId`}
        component={CommBasModify}
      />
      <AuthLayout exact path={RouterPath.report} component={Report} />
      {/* 내정보 */}
      <AuthLayout exact path={RouterPath.mypage} component={MyPage} />
      <AuthLayout exact path={RouterPath.order} component={Order} />
      <AuthLayout
        exact
        path={`${RouterPath.orderdetail}/:resvId`}
        component={OrderDetail}
      />
      <AuthLayout exact path={RouterPath.setting} component={Setting} />
      <AuthLayout exact path={RouterPath.mypageedit} component={MyPageEdit} />
      <AuthLayout
        exact
        path={RouterPath.keywordMenuEdit}
        component={KeywordMenuEdit}
      />
      <AuthLayout
        exact
        path={RouterPath.keywordPartEdit}
        component={KeywordPartEdit}
      />
      <AuthLayout exact path={RouterPath.pwdedit} component={PwdEdit} />
      <AuthLayout exact path={RouterPath.watchplace} component={WatchPlace} />
      <AuthLayout exact path={RouterPath.watchexpert} component={WatchExpert} />
      <AuthLayout exact path={RouterPath.watchreview} component={WatchReview} />
      <AuthLayout exact path={RouterPath.watchset} component={WatchSet} />
      <AuthLayout exact path={RouterPath.qnapage} component={QnApage} />
      <AuthLayout exact path={RouterPath.myfollower} component={MyFollower} />
      <AuthLayout
        exact
        path={RouterPath.userfollower}
        component={UserFollower}
      />
      {/* 공지사항 */}
      <AuthLayout exact path={RouterPath.notice} component={Notice} />
      <AuthLayout
        exact
        path={`${RouterPath.noticedetail}/:noticeId`}
        component={NoticeDetail}
      />
      {/** 이용약관 */}
      <AuthLayout exact path={RouterPath.terms} component={Terms} />
      <AuthLayout exact path={RouterPath.chicaterms} component={ChicaTerms} />
      <AuthLayout exact path={RouterPath.license} component={License} />
      <AuthLayout
        exact
        path={RouterPath.privacypolish}
        component={PrivacyPolish}
      />
      {/* 탈퇴하기 */}
      <AuthLayout exact path={RouterPath.delaccount} component={DelAccount} />
      {/* 시카 지갑 */}
      <AuthLayout exact path={RouterPath.wallet} component={Wallet} />
      {/* test */}
      <Layout exact path={RouterPath.testCalander} component={CalanderTest} />
      <Layout exact path={RouterPath.testMap} component={MapTest} />
      <Layout
        exact
        path={RouterPath.testWalletShare}
        component={WalletShareTest}
      />
      <AuthLayout
        exact
        path={RouterPath.testMobileDatePicker}
        component={MobileDatePickerTest}
      />

      {/* 404 */}
      <Layout component={Errors} />
    </Switch>
  );
}

export default Router;
