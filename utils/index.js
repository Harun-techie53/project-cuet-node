exports.formattedEmailAndName = (reqEmail) => {
    //u1809030@student.cuet.ac.bd
        //u[0-9]{2}[0-1]{1}[0-9]{1}[0-9]{3}@student.cuet.ac.bd
    if(reqEmail) {
        let regex = new RegExp('u[0-9]{2}0[0-9]{4}@student.cuet.ac.bd');
        if(!regex.test(reqEmail)) throw new Error('Email is not correctly formatted!');
    }

    let name;
    // if(reqName) {
    //     const capitalizeName = str => str.split(' ').map(sub => sub.charAt(0).toUpperCase() + sub.slice(1)).join(' ');
    //     name = capitalizeName(reqName);
    // }

    // return name;
}