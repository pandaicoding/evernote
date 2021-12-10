import { FaBook, FaPlus, FaSearch, FaSignOutAlt } from "react-icons/fa"
import { ListNotesDocument, useAddNoteMutation, useListNotesQuery, useLogoutMutation, useMeQuery } from '../../generated/graphql';
import { clearToken } from '../../helper/auth';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { debounceFn } from '../../helper/debounce';
import styled from "@emotion/styled";
import { GENERICS, MIXINS } from "../GlobalStyle";


export default function Navigation() {
  const { replace } = useHistory()
  const [submitLogout, { client }] = useLogoutMutation()
  const { data } = useMeQuery()
  const [submitAddNote] = useAddNoteMutation()
  const [searchText, setSearchText] = useState<string>("")
  const { refetch } = useListNotesQuery()

  const onLogoutHandler = async () => {
    try {
      await submitLogout()
      client.stop()
      await client.resetStore()
      clearToken()
      replace("/login")
    } catch (error) {
      console.log(error);
    }
  }

  const onAddNoteHandler = async () => {
    try {
      const note = await submitAddNote({
        variables: {
          title: "Title",
          content: "Content",
        },
      });
      const { listNotes } = client.readQuery({ query: ListNotesDocument });
      client.writeQuery({
        query: ListNotesDocument,
        data: {
          listNotes: [note.data?.addNote, ...listNotes],
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onSearchHandler = debounceFn(async () => {
    await refetch({ search: searchText }).then(({ data: { listNotes } }) => {
      client.writeQuery({
        query: ListNotesDocument,
        data: {
          listNotes,
        },
      });
    });
  }, 1000);

  useEffect(() => {
    onSearchHandler();
  }, [searchText, onSearchHandler]);

  return (
    <NavigationStyled>
      <div className='user-profile'>
        <div>{data?.me?.display_name.substring(0, 1).toUpperCase()}</div>
        <span>{data?.me?.display_name}</span>
        <span onClick={onLogoutHandler}><FaSignOutAlt /></span>
      </div>
      <div className='search-container'>
        <FaSearch />
        <input
          placeholder="Search"
          value={searchText}
          onChange={({ target }) => setSearchText(target.value)}
        />
      </div>
      <div className='new-note-button' onClick={onAddNoteHandler}>
        <FaPlus />
        <span>New Note</span>
      </div>
      <ul className='nav-menu'>
        <li>
          <FaBook />
          <span>All Book</span>
        </li>
      </ul>
    </NavigationStyled>
  )

}

const NavigationStyled = styled.div`
width: 100%;
  height: 100%;
  max-width: 300px;
  background-color: ${GENERICS.colorBlack};
  color: #ccc;
  .user-profile {
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    align-items: center;
    padding: 1.2em;
    gap: 1em;
    > div:first-of-type {
      background-color: ${GENERICS.primaryColor};
      color: white;
      width: 2em;
      height: 2em;
      border-radius: 50%;
      ${MIXINS.va()}
    }
    > span:nth-of-type(1) {
      white-space: nowrap;
    }
    > span:last-child {
      justify-self: flex-end;
      cursor: pointer;
      transition: 0.3s;
      padding: 5px;
      &:hover {
        color: red;
      }
    }
  }
  .search-container {
    ${MIXINS.va()}
    padding-block: 0.5em;
    border-radius: 1em;
    background-color: ${GENERICS.colorBlackCalm};
    margin: 0 1.2em;
    margin-bottom: 1em;
    gap: 1em;
    > input {
      background-color: transparent;
      color: #ccc;
      border: none;
      font-size: 1em;
      outline: none;
    }
  }
  .new-note-button {
    ${MIXINS.va("left")}
    cursor: pointer;
    gap: 1em;
    color: white;
    border-radius: 1em;
    padding: 0.5em 1em;
    margin: 0 1.2em;
    background-color: ${GENERICS.primaryColor};
    &:hover {
      background-color: ${GENERICS.primaryColorDark};
    }
  }
  .active {
    background-color: #444;
    color: white;
  }
  .nav-menu {
    margin-top: 1em;
    > li {
      ${MIXINS.va("left")}
      gap: 1em;
      padding: 1em 1.2em;
      cursor: pointer;
      &:hover {
        background-color: #333;
      }
    }
  }
`;