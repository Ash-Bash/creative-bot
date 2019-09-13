import * as React from 'react';
import {
  PageMain,
  PageTitle,
  PageContent,
  PageTitleRight
} from '../generic-styled-components/Page';
import styled from 'styled-components';
import { List } from 'react-virtualized/dist/commonjs/List';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import { ISize, IListRenderer } from '@/renderer';
import { User } from '@/renderer/helpers/db/db';
import { rxUsersArray } from '@/renderer/helpers/rxUsers';
import { sortBy, reverse } from 'lodash';
import { FaAngleDown, FaAngleUp, FaEdit } from 'react-icons/fa';
import { StyledInput } from '../generic-styled-components/StyledInput';
import { getPhrase } from '@/renderer/helpers/lang';
import {
  PopupDialogBackground,
  PopupDialog
} from '../generic-styled-components/PopupDialog';
import { Icon } from '../generic-styled-components/Icon';
import { UserPopup } from './UserPoup';

const PageContentCustom = styled(PageContent)`
  padding: unset;
`;

const PageTitleCustom = styled(PageTitle)`
  overflow: hidden;
  min-height: 55px;
  & > div {
    padding-bottom: 19px;
  }
`;

const PageTitleRightCustom = styled(PageTitleRight)`
  padding-bottom: 19px;
  height: 47px;
`;

interface IUserHeader {
  background?: string;
  borderColor?: string;
}

const UsersHeader = styled.div`
  height: 25px;
  display: flex;
  position: absolute;
  align-items: center;
  bottom: 0px;
  width: -webkit-fill-available;
  font-size: 18px;
  left: 0;
  padding-left: 10px;
  border-top: 1px solid
    ${(props: IUserHeader): string =>
      props.borderColor ? props.borderColor : '#d1d1d1'};
  border-bottom: 1px solid
    ${(props: IUserHeader): string =>
      props.borderColor ? props.borderColor : '#d1d1d1'};
  background: ${(props: IUserHeader): string =>
    props.background ? props.background : '#e1e1e1'};
`;

interface IUserColumn {
  hover?: boolean;
}

const UsersColumn = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  user-select: ${(props: IUserColumn): string =>
    props.hover ? 'none' : 'inherit'};
  &:hover {
    cursor: ${(props: IUserColumn): string =>
      props.hover ? 'pointer' : 'unset'};
  }
`;

interface IUserRow {
  alternate: boolean;
  alternateBackground?: string;
  backgroundColor?: string;
}

const UserRow = styled.div`
  width: -webkit-fill-available;
  height: 40px;
  display: flex;
  align-items: center;
  /* padding-left: 10px; */
  & > div:nth-child(1) {
    padding-left: 10px;
  }
  background: ${(props: IUserRow): string =>
    props.alternate
      ? props.alternateBackground
        ? props.alternateBackground
        : '#e1e1e1'
      : props.backgroundColor
      ? props.backgroundColor
      : '#f1f1f1'};
`;

/**
 * @description this is the main component for the users screen
 */
export const Users = () => {
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [filter, setFilter] = React.useState<
    'displayname' | 'lino' | 'points' | 'exp'
  >('displayname');
  const [filterFlip, setFliterFlip] = React.useState<boolean>(false);
  const [popup, setPopup] = React.useState<React.ReactElement | null>(null);

  const [searchText, setSearchtext] = React.useState<string>('');

  React.useEffect(() => {
    const listener = rxUsersArray.subscribe(setAllUsers);

    return () => {
      listener.unsubscribe();
    };
  }, []);

  /**
   * @description when "username" is clicked it will toggle the filter
   */
  const toggleUsername = (): void => {
    if (filter === 'displayname') {
      setFliterFlip(!filterFlip);

      return;
    } else {
      setFliterFlip(false);
      setFilter('displayname');
    }
  };

  /**
   * @description when "level" is clicked it will toggle the filter
   */
  const toggleLevel = (): void => {
    if (filter === 'exp') {
      setFliterFlip(!filterFlip);

      return;
    } else {
      setFliterFlip(false);
      setFilter('exp');
    }
  };

  /**
   * @description when "points" is clicked it will toggle the filter
   */
  const togglePoints = (): void => {
    if (filter === 'points') {
      setFliterFlip(!filterFlip);

      return;
    } else {
      setFliterFlip(false);
      setFilter('points');
    }
  };

  /**
   * @description when "lino" is clicked it will toggle the filter
   */
  const toggleLino = (): void => {
    if (filter === 'lino') {
      setFliterFlip(!filterFlip);

      return;
    } else {
      setFliterFlip(false);
      setFilter('lino');
    }
  };

  /**
   * @description checks to see if the arrow should point down or up depending on sorting direction
   */
  const isFlipped = (type: string): boolean => {
    return filter === type ? filterFlip : false;
  };

  const updateSearchText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchtext(e.target.value);
  };

  const filteredUsers = allUsers.reduce((acc: User[], user) => {
    if (searchText.trim().length > 0) {
      if (
        user.displayname.toLowerCase().includes(searchText.toLowerCase().trim())
      ) {
        acc.push(user);
      }
    } else {
      acc.push(user);
    }

    return acc;
  }, []);

  return (
    <PageMain>
      <PageTitleCustom>
        <div>{getPhrase('users_name')}</div>{' '}
        <PageTitleRightCustom>
          <StyledInput
            onChange={updateSearchText}
            value={searchText}
            placeholder={getPhrase('users_search_placeholder')}
          />
        </PageTitleRightCustom>
        <UsersHeader style={{ paddingRight: '5px', paddingBottom: '0px' }}>
          <UsersColumn hover={true} onClick={toggleUsername}>
            {getPhrase('users_column_username')}{' '}
            {isFlipped('displayname') ? (
              <FaAngleDown size={15} style={{ paddingLeft: '5px' }} />
            ) : (
              <FaAngleUp size={15} style={{ paddingLeft: '5px' }} />
            )}
          </UsersColumn>
          <UsersColumn hover={true} onClick={toggleLevel}>
            {getPhrase('users_column_level')}{' '}
            {isFlipped('exp') ? (
              <FaAngleDown size={15} style={{ paddingLeft: '5px' }} />
            ) : (
              <FaAngleUp size={15} style={{ paddingLeft: '5px' }} />
            )}
          </UsersColumn>
          <UsersColumn hover={true} onClick={togglePoints}>
            {getPhrase('users_column_points')}{' '}
            {isFlipped('points') ? (
              <FaAngleDown size={15} style={{ paddingLeft: '5px' }} />
            ) : (
              <FaAngleUp size={15} style={{ paddingLeft: '5px' }} />
            )}
          </UsersColumn>
          <UsersColumn hover={true} onClick={toggleLino}>
            {getPhrase('users_column_lino')}{' '}
            {isFlipped('lino') ? (
              <FaAngleDown size={15} style={{ paddingLeft: '5px' }} />
            ) : (
              <FaAngleUp size={15} style={{ paddingLeft: '5px' }} />
            )}
          </UsersColumn>
          <UsersColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {getPhrase('users_column_edit')}
          </UsersColumn>
        </UsersHeader>
      </PageTitleCustom>
      <PageContentCustom>
        <AutoSizer>
          {(size: ISize): React.ReactElement => {
            const { width, height } = size;

            return (
              <List
                style={{
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px'
                }}
                width={width}
                height={height}
                rowHeight={40}
                rowCount={filteredUsers.length}
                rowRenderer={({
                  index,
                  key,
                  style
                }: IListRenderer): React.ReactElement => {
                  /**
                   * @description takes allUsers and sorts by filter
                   *
                   * Note: if filter is displayname then it needs to toLowerCase all the names, else lowercase and uppercase will be seperated
                   */
                  const sorted = sortBy(filteredUsers, (mUser: User) => {
                    if (filter === 'displayname') {
                      return mUser.displayname.toLowerCase();
                    } else {
                      return mUser[filter];
                    }
                  });
                  const user = (filterFlip ? reverse(sorted) : sorted)[index];
                  const editUserPopup = () => {
                    const closePopup = () => {
                      setPopup(null);
                    };
                    setPopup(<UserPopup user={user} closePopup={closePopup} />);
                  };

                  return (
                    <UserRow style={style} key={key} alternate={!!(index % 2)}>
                      <UsersColumn>{user.displayname}</UsersColumn>
                      <UsersColumn>1</UsersColumn>
                      <UsersColumn>{user.points}</UsersColumn>
                      <UsersColumn>{user.getLino()}</UsersColumn>
                      <UsersColumn
                        style={{
                          maxWidth: 'min-content',
                          minWidth: '50px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon>
                          <FaEdit size='20px' onClick={editUserPopup}></FaEdit>
                        </Icon>
                      </UsersColumn>
                    </UserRow>
                  );
                }}
              />
            );
          }}
        </AutoSizer>
      </PageContentCustom>
      {popup ? <PopupDialogBackground>{popup}</PopupDialogBackground> : null}
    </PageMain>
  );
};