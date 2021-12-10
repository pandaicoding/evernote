import styled from '@emotion/styled';
import { Redirect } from 'react-router-dom';
import ListNotes from '../../components/note/ListNotes'
import { Wrapper } from '../../components/Wrapper'
import { isAuthenticated } from '../../helper/auth';
import Navigation from '../../components/navigation/Navigation';

export default function Home() {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />
  }
  return (
    <HomeStyled>
      <Navigation />
      <ListNotes />
    </HomeStyled>
  )
}


const HomeStyled = styled(Wrapper)`
  display: flex;
`;