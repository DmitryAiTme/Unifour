import { useState, useEffect } from 'react';

export default function TwitterModule({ posts }) {

  function splitter(text) {
    const arr = [];
    const texts = text.split("\\n");
    texts.map((txt, i) => arr.push(<p key={i}> {txt} </p>));
    return arr;
  }

  return (
    <div className="page">
      {posts.map((post, index) => (
        <div className="post" key={index}>
            <ul style={{whiteSpace: "pre-wrap"}}> { splitter(post.title) } <img src={post.content} /> </ul>
        </div>
      ))}
    </div>
  );
};
