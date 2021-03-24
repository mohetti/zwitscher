import uniqid from 'uniqid';
import { Button } from 'react-bootstrap';

function Explore(props) {
  const content = props.otherAccounts.map((el) => {
    if (
      props.currentPerson.following.length === 0 ||
      props.currentPerson === undefined
    ) {
      return (
        <div key={uniqid()}>
          <div>{el.name}</div>
          <Button id={el.uid} onClick={props.followUser}>
            Follow
          </Button>
        </div>
      );
    } else if (!props.currentPerson.following.includes(el.uid)) {
      return (
        <div key={uniqid()}>
          <div>{el.name}</div>
          <Button id={el.uid} onClick={props.followUser}>
            Follow
          </Button>
        </div>
      );
    } else {
      return;
    }
  });

  return (
    <div>
      <h3>People, you migh want to follow</h3>
      <div>{content}</div>
    </div>
  );
}

export default Explore;
