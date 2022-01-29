const { user, profile, follow } = require("../../models");

exports.getUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser"],
        },
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    let dataUser = users.map((data) => {
      return {
        id: data.id,
        fullName: data.name,
        email: data.email,
        username: data.username,
        image: data.profile.image,
        bio: data.profile.bio,
      };
    });

    res.send({
      status: "success",
      data: {
        dataUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(req.file);
    await profile.update(
      { ...req.body, image: req.file.filename },
      {
        where: {
          idUser: id,
        },
      }
    );

    res.send({
      status: "success",
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await user.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete user id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const followers = await follow.findAll({
      where: {
        idFollowing: id,
      },
      attributes: ["id", "idUser"],
      include: {
        model: user,
        as: "follower",
        attributes: ["id", "fullName", "username"],
        include: {
          model: profile,
          as: "profile",
          attributes: ["idUser", "image", "bio"],
        },
      },
    });

    const dataFollowers = followers.map((data) => {
      return {
        id: data.id,
        user: {
          id: data.follower.id,
          fullName: data.follower.fullName,
          username: data.follower.username,
          image: data.follower.profile.image,
        },
      };
    });

    res.status(200).send({
      status: "success",
      data: {
        followers: dataFollowers,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const followings = await follow.findAll({
      where: {
        idUser: id,
      },
      attributes: ["id", "idUser"],
      include: {
        model: user,
        as: "following",
        attributes: ["id", "fullName", "username"],
        include: {
          model: profile,
          as: "profile",
          attributes: ["idUser", "image", "bio"],
        },
      },
    });

    const dataFollowings = followings.map((data) => {
      return {
        id: data.id,
        user: {
          id: data.following.id,
          fullName: data.following.fullName,
          username: data.following.username,
          image: data.following.profile.image,
        },
      };
    });

    res.status(200).send({
      status: "success",
      data: {
        followings: dataFollowings,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};
