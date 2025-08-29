from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.sqlite import BLOB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
from .database import Base

class Hobby(Base):
    __tablename__ = "hobby"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String, nullable=False)
    fields = relationship("Field", back_populates="hobby", cascade="all, delete-orphan")
    items = relationship("Item", back_populates="hobby", cascade="all, delete-orphan")

class Field(Base):
    __tablename__ = "field"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    hobby_id = Column(String, ForeignKey("hobby.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    hobby = relationship("Hobby", back_populates="fields")
    combo_options = relationship("ComboOption", back_populates="field", cascade="all, delete-orphan")
    item_values = relationship("ItemValue", back_populates="field", cascade="all, delete-orphan")

class Item(Base):
    __tablename__ = "item"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    hobby_id = Column(String, ForeignKey("hobby.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    hobby = relationship("Hobby", back_populates="items")
    values = relationship("ItemValue", back_populates="item", cascade="all, delete-orphan")

class ItemValue(Base):
    __tablename__ = "item_value"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    item_id = Column(String, ForeignKey("item.id"), nullable=False)
    field_id = Column(String, ForeignKey("field.id"), nullable=False)
    value_text = Column(String)
    value_int = Column(Integer)
    value_bool = Column(Boolean)
    combo_option_id = Column(String, ForeignKey("combo_option.id"))
    item = relationship("Item", back_populates="values")
    field = relationship("Field", back_populates="item_values")
    combo_option = relationship("ComboOption", back_populates="item_values")

class ComboOption(Base):
    __tablename__ = "combo_option"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    field_id = Column(String, ForeignKey("field.id"), nullable=False)
    value = Column(String, nullable=False)
    field = relationship("Field", back_populates="combo_options")
    item_values = relationship("ItemValue", back_populates="combo_option")
