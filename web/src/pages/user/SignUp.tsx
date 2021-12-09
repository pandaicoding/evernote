import { ChangeEvent, FormEvent, useState } from "react"
import { useSignupMutation } from "../../generated/graphql"
import { Wrapper } from '../../components/Wrapper';
import Penguin from '../../asset/icon/Penguin';
import styled from '@emotion/styled';
import { GENERICS } from '../../components/GlobalStyle';
import { Link, RouterProps } from "react-router-dom";

export default function SignUp({ history }: RouterProps) {
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
  })

  const [submitSingUp, { error, loading }] = useSignupMutation()

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await submitSingUp({
        variables: {
          ...form,
        },
      })
      history.push("/login")
    } catch (error) {
      console.log(error)
    }
    console.log(form)
  }
  const onChangeHandler = (name: string) => ({ target }: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [name]: target.value,
    })
  }
  return (
    <Wrapper center={true}>
      <FormWrapper className="SingUp__container">
        <div className="left__side">
          <Penguin width="100%" height="100%" />
        </div>
        <div className="right__side">
          <form onSubmit={onSubmitHandler}>
            <div>
              <input type="text" placeholder='Name' value={form.displayName} onChange={onChangeHandler("displayName")} />
            </div>
            <div>
              <input type="text" placeholder='Email' value={form.email} onChange={onChangeHandler("email")} />
            </div>
            <div>
              <input type="password" placeholder='Password' value={form.password} onChange={onChangeHandler("password")} />
            </div>

            <div>
              <button disabled={loading} type="submit">
                {loading ? "..." : "Register"}
              </button>
              <p>
                Already have an account? <Link to="/login"> Login here</Link>
              </p>
            </div>

            {error && error.graphQLErrors.map(({ message }, i) => (
              <div key={i}><small className="error-message">{JSON.stringify(error.message)}</small></div>
            ))}
          </form>
        </div>
      </FormWrapper>
    </Wrapper>
  )
}

const FormWrapper = styled("div")`
  display: flex;
  align-items: center;
  border: ${GENERICS.border};
  border-radius: 5px;
  padding: 50px;
  user-select: none;
  gap: 20px;
  > div {
    flex: 0.5;
  }
  .left__side {
    img {
      width: 200px;
    }
  }
  .right__side {
    > div:first-of-type {
      text-align: center;
      img {
        width: 50px;
        border-radius: 10px;
      }
      margin-bottom: 20px;
    }
    form {
      .text-error {
        padding: 5px 0;
        color: red;
      }
      div {
        margin-bottom: 10px;
        input {
          border: 2px solid gray;
          border-radius: 5px;
          width: 100%;
          padding: 1em;
          outline: none;
          transition: 0.5s;
          &:focus {
            border-color: blue;
          }
        }
        button {
          border-radius: 5px;
          margin-top: 1em;
          width: 100%;
          color: white;
          background-color: ${GENERICS.primaryColor};
          padding: 1em;
          &:disabled {
            background-color: #ccc;
          }
        }
        small.error-message {
          color: red;
        }
      }
      p {
        display: flex;
        justify-content: center;
        margin-block: 1.5em;
        font-size: 12px;
        a {
          color: ${GENERICS.primaryColor};
          margin-left: 0.5em;
        }
      }
    }
  }
`;
