import React, { useState, useEffect } from "react";
import "./list.css";
import Loader from "../Loader/Loader";

const List = (props) => {
  const [userDetails, setUserDetails] = useState([]);
  const [allUsers, setallUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [since, setSince] = useState(props.id);
  const [perPage, setPerPage] = useState(props.count);

  useEffect(() => {
    async function getUsers() {
      let usersList = await fetch(
        `https://api.github.com/users?page=1&per_page=${perPage}&since=${since}`
      )
        .then((resp) => resp.json())
        .then((data) => {
          data.sort(function (a, b) {
            return a.id - b.id;
          });
          setallUsers(data);
          return data;
        })
        .catch((error) => setError(error));

      await usersList.map((user) => {
        return fetch(`https://api.github.com/users/${user.login}`)
          .then((resp) => resp.json())
          .then((data) => {
            setUserDetails((userDetails) => [...userDetails, data]);
          })
          .catch((error) => setError(error));
      });
      setLoading(false);
    }
    getUsers();
  }, [perPage, since]);

  useEffect(() => {
    setSince(props.id);
    setPerPage(props.count);
    setUserDetails([]);
    setLoading(true);
  }, [props.id, props.count]);

  const deleteUser = (id) => {
    let userList = userDetails.filter((user) => user.id !== id);
    setUserDetails(userList);
  };

  window.onscroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setSince(allUsers[allUsers.length - 1].id);
    }
  };
  return (
    <>
      {!loading ? (
        !error ? (
          <div>
            {userDetails.map((user) => {
              return (
                <div
                  key={user.id}
                  className="usercard"
                  style={{
                    backgroundColor: user.followers > 10 ? "#de3d7b" : "#4356c4"
                  }}
                >
                  <button className="link" onClick={() => deleteUser(user.id)}>
                    x
                  </button>
                  <span className="username name">{user.login}</span>
                  <img
                    src={user.avatar_url}
                    alt="profile"
                    className="profile"
                  />
                  <span className="name">{user.name ? user.name : "User"}</span>
                  <span className="name">{user.id}</span>
                  <div className="details">
                    <span className="repo">
                      Public Repos : {user.public_repos}
                    </span>
                    <span className="repo">Followers : {user.followers}</span>
                    <span className="repo">Following : {user.following}</span>
                  </div>
                  <a href={user.html_url} className="gitUrl">
                    Check on Github
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <p>{error}</p>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default List;
