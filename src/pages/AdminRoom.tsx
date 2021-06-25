import { useHistory, useParams } from "react-router-dom";

import logo from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useauth";
import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";
import { database } from "../services/firebase";




type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory()
  //const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const {title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({ 
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }
 

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logo} alt="LetMeAsk" />
          <div>
          <RoomCode code={roomId} />
          <Button isOutlined onClick={handleEndRoom} >Encerrar a Sala</Button>
          </div>
        </div>
      </header>
      <div className="center">
        <main className="content">
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && (
              <span>{questions.length} pergunta(s)</span>
            )}
          </div>
          <div className="question-list">
            {questions.map((question) => {
              return (
                <Question key={question.id} content={question.content} author={question.author}>
                  <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                    <img src={deleteImg} alt="Remover Pergunta"/>
                  </button>
                  </Question>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
