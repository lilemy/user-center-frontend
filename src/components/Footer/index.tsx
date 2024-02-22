import {GithubOutlined} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '小新出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'user-center-frontend',
          title: 'user-center-frontend',
          href: 'https://github.com/lilemy/user-center-frontend',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined/>,
          href: 'https://github.com/lilemy',
          blankTarget: true,
        },
        {
          key: 'user-center-backend',
          title: 'user-center-backend',
          href: 'https://github.com/lilemy/user-center-backend',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
