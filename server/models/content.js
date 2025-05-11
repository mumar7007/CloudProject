module.exports = (sequelize, DataTypes) => {
  const Content = sequelize.define('Content', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contentType: {
      type: DataTypes.ENUM('video', 'document', 'image', 'link'),
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ageGroup: {
      type: DataTypes.STRING,
      allowNull: false
    },
    classLevel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  return Content;
}; 