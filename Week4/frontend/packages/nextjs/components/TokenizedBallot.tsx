import { CastVote } from "./CastVote";
import { Delegate } from "./Delegate";
 import { Query } from "./Query";

export function TokenizedBallot() {



    return (
      <div className="card flex  w-[100%] p-4    text-primary-content mt-4 gap-4 justify-center items-center">
        <h1 className="bg-primary font-bold text-4xl rounded-3xl p-4 text-cyan-300">Tokenized Ballot</h1>
        <CastVote/>
        <Delegate/> 
        <Query/>
      </div>
    );
  }