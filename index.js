// Name generation code for the RWBY Team Name Generator.

window.onload = () => {
  const form = document.querySelector('form')

  form.addEventListener('submit', ev => {
    ev.preventDefault() // Prevent the form from submitting.

    // Get output div and input values.
    // Also replaces any missing last names with a duplicated first name to
    //   let me focus on compiling the lists and just filter out duplicates later.
    let output = document.getElementById("output"),
        fnames = Array.from(form.fname).map(i => i.value.trim()),
        lnames = Array.from(form.lname).map(i => i.value.trim()).map((n,i) => n || fnames[i]),
        leader = form.leader.value
    output.innerHTML = ""

    // Loop through each team member, skipping members who aren't the leader.
    ;[0,1,2,3].forEach(i => {
      if(leader != -1 && leader != i) return

      // Get the leader's initials and arrays of the other teammates' initials.
      let finit = fnames[i][0],
          linit = lnames[i][0],
          finits = fnames.filter((_,n) => n != i).map(n => n[0]),
          linits = lnames.filter((_,n) => n != i).map(n => n[0]),
          tinits = [[finits[0], linits[0]],[finits[1], linits[1]],[finits[2], linits[2]]],

      // Collate all the team names using only first/last names into separate
      //   alphabetized lists, ready for output.
          fnamesonly = Combinatorics.permutation(finits).toArray().map(a => finit+a.join('')+"<br/>").sort(alphaSort).join('\n'),
          lnamesonly = Combinatorics.permutation(linits).toArray().map(a => linit+a.join('')+"<br/>").sort(alphaSort).join('\n'),

      // Get all the possible orders of the other 3 teammates, then take the
      //   Cartesian product of their initials for each order. This gets us
      //   an array of every possible team name under the current leader,
      //   minus the leader's initial.
          tmts = Combinatorics.permutation(tinits).toArray(),
          all0 = tmts.map(l => Combinatorics.cartesianProduct(...l)).map(x => x.toArray()).reduce((a,c) => a.concat(c), []),

      // Map over the previous list twice, once prepending the leader's first
      //   initial and once their last initial, then sort alphabetically.
          all1 = all0.map(x => finit+x.join('')).sort(alphaSort),
          all2 = all0.map(x => linit+x.join('')).sort(alphaSort),

      // Filter out duplicates and prepare for output.
          all = all1.concat(all2).filter((v,i,s) => s.indexOf(v) === i).join('<br/>')


      // Output the finished HTML chunk.
      output.innerHTML += `
        <h2 class='spoilertoggle' spoiler=${i}>${fnames[i]} as leader</h2>
        <div spoiler=${i}>
          <div class=col2>
            <i>First names only</i><br/>${fnamesonly}<br/>
            <i>Last names only</i><br/>${lnamesonly}<br/>
          </div>
          <i>All possible team names</i><br/>
          <div class=col4>${all}</div>
          <br/>
        </div>
      `
    })

    // Now that we've added all the lists, set up the click
    //   events for the header dropdowns.
    document.querySelectorAll('.spoilertoggle').forEach(el => el.onclick = () => {
      let id = el.getAttribute('spoiler'),
          other = el.parentNode.querySelector(`div[spoiler="${id}"]`)
      el.classList.toggle('open')
      other.classList.toggle('open')
    })
  })
}

// Deep alphabetical sorting function.
// Sorts into proper alphabetical order rather than just
//   by the first letter like the simpler (a,b) => a.localeCompare(b)
// Sorts longer strings after shorter.
// Will stack overflow on very long strings, so copy-paste with caution.
function alphaSort(a,b) {
  return a.length > 0 && b.length > 0
    ? a[0].localeCompare(b[0]) || alphaSort(a.substring(1), b.substring(1))
    : a.length - b.length
}
