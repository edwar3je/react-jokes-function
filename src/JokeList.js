import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

/** List of jokes. */

const JokeList = ({numJokesToGet=5}) => {
    
    /** Set initial state for "jokes" and "isLoading" */

    const [jokes, setJokes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    /** Retrieves jokes upon first render */

    useEffect(() => {
        getJokes();
    }, []);

    /** Fills the "jokes" state with "n" number of jokes based on numJokesToGet (default 5).
     *  Also turns the state of "isLoading" to false at the end.
     */

    const getJokes = async () => {
        try {
            let jokes = [];
            let seenJokes = [];

            while (jokes.length < numJokesToGet){
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                });
                let { ...joke } = res.data;

                if (!seenJokes.includes(joke.id)){
                    seenJokes.push(joke.id);
                    jokes.push({ ...joke, votes: 0 });
                } else {
                    console.log("duplicate found!");
                }
            }

            setJokes(jokes);
            setIsLoading(false);

        } catch (err) {
            console.error(err)
        }
    };

    /** Sets the state of "isLoading" to "true" and gets a new list of jokes to render. */ 

    const generateNewJokes = () => {
        setIsLoading(true);
        getJokes();
    };

    /** Changes the number of votes on an individual joke in state by generating a new array of jokes using map. 
     *  If the joke has the same id as in the argument, that joke's vote count is changed according to the delta.
     *  If not, said joke's vote count (and other information) will remain the same. */

    const vote = (id, delta) => {
        setJokes(jokes => jokes.map(j => 
            j.id === id ? { ...j, votes: j.votes + delta } : j
        ));
    };

    /** If isLoading is true, a spinner will render. If not, the jokes will render (always loads upon first render). */

    if(isLoading){
        return (
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        );
    } else {
        let sortedJokes = jokes.sort((a, b) => b.votes - a.votes);
        return (
            <div className="JokeList">
                <button className="JokeList-getmore" onClick={generateNewJokes}>
                    Get New Jokes
                </button>

                {sortedJokes.map(j => (
                    <Joke 
                        text={j.joke}
                        key={j.id}
                        id={j.id}
                        votes={j.votes}
                        vote={vote}
                    />
                ))}
            </div>
        );
    };
};

export default JokeList;