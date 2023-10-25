import React from 'react';
import { Container, Image, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import RouterPath from '../../common/constants/RouterPath';

export default React.memo(function Errors(props) {
  const { t, i18n } = useTranslation();
  return (
    <main id="errors">
      <Container>
        <h2>404</h2>
        {/* <p className="text-gray">페이지를 찾을 수 없습니다.</p> */}
        <p className="text-gray">{t('pageNotFount')}</p>
        <Button
          className="w-auto"
          variant="outline-white"
          size="lg"
          onClick={() => props.history.push(RouterPath.slash)}
        >
          {/* 홈으로 돌아가기 */}
          {t('backToHome')}
        </Button>
      </Container>
    </main>
  );
});
