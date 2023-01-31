module.exports=({req}) =>{
    return `<div>
    your ID is: ${req.session.userID}
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" /> 
      <input name="passwordConfirmation" placeholder="password confirmation" /> 
      <button type="submit"> sign up </button>
    </form>
 </div>
`
}